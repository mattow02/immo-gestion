"use server"

import { createClient } from "@/lib/supabase/server"

export async function activateInvitation(code: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("activate_invitation", {
    code_text: code,
  })

  if (error) return { error: error.message }

  const result = data as { error?: string; success?: boolean }
  if (result.error) return { error: result.error }

  return { success: true }
}
