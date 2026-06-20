import { Wallet, Calendar, MessageSquare } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { formatCurrency } from "@/lib/constants"
import type { Tenancy, Property } from "@/lib/types/database"

export function TenantOverview({
  tenancy,
  openRequestsCount,
}: {
  tenancy: Tenancy & { property: Property }
  openRequestsCount: number
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatsCard
        title="Loyer mensuel"
        value={formatCurrency(tenancy.rent_amount)}
        icon={Wallet}
      />
      <StatsCard
        title="Debut du bail"
        value={new Date(tenancy.start_date).toLocaleDateString("fr-FR")}
        icon={Calendar}
      />
      <StatsCard
        title="Demandes en cours"
        value={String(openRequestsCount)}
        icon={MessageSquare}
      />
    </div>
  )
}
