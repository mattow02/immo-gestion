import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { DashboardOverview } from "@/components/dashboard/overview"
import { PropertiesSummary } from "@/components/dashboard/properties-summary"
import type { Property } from "@/lib/types/database"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })

  const props = (properties ?? []) as Property[]

  return (
    <>
      <Header title="Dashboard" />
      <div className="p-6 space-y-6">
        <DashboardOverview properties={props} />
        <PropertiesSummary properties={props} />
      </div>
    </>
  )
}
