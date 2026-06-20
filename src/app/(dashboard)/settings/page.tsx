import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { SettingsForm } from "@/components/settings-form"
import { updateProfile } from "./actions"
import type { Profile } from "@/lib/types/database"

export const metadata = { title: "Parametres" }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single()

  return (
    <>
      <Header title="Parametres" />
      <div className="p-6 max-w-2xl">
        <SettingsForm profile={profile as Profile} action={updateProfile} />
      </div>
    </>
  )
}
