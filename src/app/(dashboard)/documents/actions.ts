"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { documentSchema } from "@/lib/validations/document"

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const file = formData.get("file") as File
  if (!file || file.size === 0) return { error: "Fichier requis" }
  if (file.size > 10 * 1024 * 1024) return { error: "Fichier trop volumineux (max 10 Mo)" }

  const metadata = {
    property_id: formData.get("property_id") as string,
    tenancy_id: formData.get("tenancy_id") as string,
    type: formData.get("type") as string,
    name: formData.get("name") as string,
  }

  const parsed = documentSchema.safeParse(metadata)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const ext = file.name.split(".").pop() || "bin"
  const storagePath = `${user.id}/${parsed.data.property_id}/${Date.now()}_${parsed.data.name.replace(/[^a-zA-Z0-9]/g, "_")}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, file)

  if (uploadError) return { error: uploadError.message }

  const { error: insertError } = await supabase.from("documents").insert({
    property_id: parsed.data.property_id,
    tenancy_id: parsed.data.tenancy_id || null,
    type: parsed.data.type,
    name: parsed.data.name,
    file_path: storagePath,
    uploaded_by: user.id,
  })

  if (insertError) return { error: insertError.message }

  revalidatePath("/documents")
}

export async function deleteDocument(documentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const { data: doc } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", documentId)
    .single()

  if (!doc) return { error: "Document non trouve" }

  await supabase.storage.from("documents").remove([doc.file_path])

  const { error } = await supabase.from("documents").delete().eq("id", documentId)
  if (error) return { error: error.message }

  revalidatePath("/documents")
}

export async function getDocumentSignedUrl(documentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const { data: doc } = await supabase
    .from("documents")
    .select("file_path, name")
    .eq("id", documentId)
    .single()

  if (!doc) return { error: "Document non trouve" }

  const { data: signed } = await supabase.storage
    .from("documents")
    .createSignedUrl(doc.file_path, 60)

  if (!signed) return { error: "Impossible de generer le lien" }

  return { url: signed.signedUrl, name: doc.name }
}
