import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifie" }, { status: 401 })

  const { data: doc } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", id)
    .single()

  if (!doc) return NextResponse.json({ error: "Non trouve" }, { status: 404 })

  const { data: signed } = await supabase.storage
    .from("documents")
    .createSignedUrl(doc.file_path, 60)

  if (!signed) return NextResponse.json({ error: "Erreur generation URL" }, { status: 500 })

  return NextResponse.redirect(signed.signedUrl)
}
