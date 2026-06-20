import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { PaymentsTable } from "@/components/payments/payments-table"
import { CreatePaymentDialog } from "@/components/payments/create-payment-dialog"
import { BulkPaymentDialog } from "@/components/payments/bulk-payment-dialog"

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("payments")
    .select("*, tenancy:tenancies(*, property:properties(name, address), tenant:profiles(full_name, email))")
    .order("due_date", { ascending: false })

  if (status === "paid") query = query.eq("status", "paid")
  else if (status === "pending") query = query.eq("status", "pending")
  else if (status === "late") {
    query = query.eq("status", "pending").lt("due_date", new Date().toISOString().split("T")[0])
  }

  const { data: payments } = await query

  const { data: tenancies } = await supabase
    .from("tenancies")
    .select("id, rent_amount, tenant:profiles(full_name, email), property:properties(name, address)")
    .eq("status", "active")

  const filters = [
    { value: "all", label: "Tous" },
    { value: "paid", label: "Payes" },
    { value: "pending", label: "En attente" },
    { value: "late", label: "En retard" },
  ]
  const currentFilter = status || "all"

  return (
    <>
      <Header title="Paiements" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2">
            {filters.map((f) => (
              <Link key={f.value} href={f.value === "all" ? "/payments" : `/payments?status=${f.value}`}>
                <Button variant={currentFilter === f.value ? "default" : "outline"} size="sm">{f.label}</Button>
              </Link>
            ))}
          </div>
          <div className="flex gap-2">
            <CreatePaymentDialog tenancies={(tenancies ?? []) as never[]} />
            <BulkPaymentDialog tenancies={(tenancies ?? []) as never[]} />
          </div>
        </div>
        <PaymentsTable payments={(payments ?? []) as never[]} />
      </div>
    </>
  )
}
