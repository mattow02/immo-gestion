import { FileDown } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { TenantMobileNav } from "@/components/layout/tenant-mobile-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge"
import { formatCurrency, formatMonth, formatDate } from "@/lib/constants"
import type { Payment } from "@/lib/types/database"

export default async function TenantPaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: tenancy } = await supabase
    .from("tenancies")
    .select("id")
    .eq("tenant_id", user!.id)
    .eq("status", "active")
    .single()

  let payments: Payment[] = []
  if (tenancy) {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("tenancy_id", tenancy.id)
      .order("due_date", { ascending: false })
    payments = (data ?? []) as Payment[]
  }

  return (
    <>
      <Header title="Mes paiements" mobileNav={<TenantMobileNav />} />
      <div className="p-6 space-y-4">
        {payments.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">Aucun paiement enregistre.</p>
        ) : (
          payments.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium capitalize">{formatMonth(p.due_date)}</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(p.amount)}</p>
                  {p.paid_date && (
                    <p className="text-xs text-muted-foreground mt-1">Paye le {formatDate(p.paid_date)}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <PaymentStatusBadge status={p.status} dueDate={p.due_date} />
                  {p.status === "paid" && (
                    <a href={`/api/quittance/${p.id}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <FileDown className="h-3.5 w-3.5 mr-1.5" />
                        Quittance
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  )
}
