"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function updateRequestStatus(requestId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const validStatuses = ["open", "in_progress", "resolved", "closed"]
  if (!validStatuses.includes(status)) {
    return { error: "Statut invalide" }
  }

  const updateData: Record<string, unknown> = { status }
  if (status === "resolved") {
    updateData.resolved_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from("requests")
    .update(updateData)
    .eq("id", requestId)

  if (error) return { error: error.message }

  revalidatePath("/requests")
  revalidatePath(`/requests/${requestId}`)
  revalidatePath("/")
}
