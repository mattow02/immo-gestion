"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { requestSchema } from "@/lib/validations/request"

export async function createRequest(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const raw = Object.fromEntries(formData)
  const parsed = requestSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const propertyId = formData.get("property_id") as string
  const tenancyId = formData.get("tenancy_id") as string

  if (!propertyId) return { error: "Bien manquant" }

  const { error } = await supabase.from("requests").insert({
    tenant_id: user.id,
    property_id: propertyId,
    tenancy_id: tenancyId || null,
    title: parsed.data.title,
    description: parsed.data.description || null,
    type: parsed.data.type,
    priority: parsed.data.priority,
  })

  if (error) return { error: error.message }

  revalidatePath("/tenant/requests")
  revalidatePath("/tenant")
  redirect("/tenant/requests?created=true")
}

export async function deleteRequest(requestId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const { error } = await supabase
    .from("requests")
    .delete()
    .eq("id", requestId)
    .eq("tenant_id", user.id)
    .eq("status", "open")

  if (error) return { error: error.message }

  revalidatePath("/tenant/requests")
  revalidatePath("/tenant")
}
