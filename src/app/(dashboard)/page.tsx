import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { DashboardOverview } from "@/components/dashboard/overview"
import { PropertiesSummary } from "@/components/dashboard/properties-summary"
import type { Property, Payment } from "@/lib/types/database"

export default async function DashboardPage() {
  const supabase = await createClient()

  const now = new Date()
  const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`
  const endOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-31`
  const today = now.toISOString().split("T")[0]

  const [propertiesRes, paidRes, lateRes] = await Promise.all([
    supabase.from("properties").select("*").order("created_at", { ascending: false }),
    supabase.from("payments").select("*").eq("status", "paid").gte("paid_date", startOfMonth).lte("paid_date", endOfMonth),
    supabase.from("payments").select("*").eq("status", "pending").lt("due_date", today),
  ])

  return (
    <>
      <Header title="Dashboard" />
      <div className="p-6 space-y-6">
        <DashboardOverview
          properties={(propertiesRes.data ?? []) as Property[]}
          paidThisMonth={(paidRes.data ?? []) as Payment[]}
          latePayments={(lateRes.data ?? []) as Payment[]}
        />
        <PropertiesSummary properties={(propertiesRes.data ?? []) as Property[]} />
      </div>
    </>
  )
}
