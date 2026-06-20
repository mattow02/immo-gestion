"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function createInvitation(propertyId: string, tenantEmail?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const code = generateCode()

  const { error } = await supabase.from("invitation_codes").insert({
    code,
    property_id: propertyId,
    owner_id: user.id,
    tenant_email: tenantEmail || null,
  })

  if (error) return { error: error.message }

  revalidatePath("/tenants")
  return { code }
}

export async function deleteInvitation(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const { error } = await supabase
    .from("invitation_codes")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id)

  if (error) return { error: error.message }
  revalidatePath("/tenants")
}

export async function endTenancy(tenancyId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const { error } = await supabase
    .from("tenancies")
    .update({ status: "ended", end_date: new Date().toISOString().split("T")[0] })
    .eq("id", tenancyId)

  if (error) return { error: error.message }

  revalidatePath("/tenants")
  revalidatePath("/")
}
