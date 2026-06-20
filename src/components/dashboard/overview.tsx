import { Building2, TrendingUp, Wallet, PieChart, Home, AlertTriangle } from "lucide-react"
import { StatsCard } from "./stats-card"
import { formatCurrency, formatPercent } from "@/lib/constants"
import type { Property, Payment } from "@/lib/types/database"

type DashboardMetrics = {
  totalProperties: number
  rentedCount: number
  vacantCount: number
  maintenanceCount: number
  occupancyRate: number | null
  monthlyRevenue: number
  annualExpected: number
  portfolioValue: number
  averageGrossYield: number | null
  lateCount: number
  lateAmount: number
}

function computeMetrics(
  properties: Property[],
  paidThisMonth: Payment[],
  latePayments: Payment[],
): DashboardMetrics {
  const total = properties.length
  const rented = properties.filter((p) => p.status === "rented")
  const vacant = properties.filter((p) => p.status === "vacant")
  const maintenance = properties.filter((p) => p.status === "maintenance")

  const monthlyRevenue = paidThisMonth.reduce((sum, p) => sum + p.amount, 0)
  const expectedMonthly = rented.reduce((sum, p) => sum + (p.current_rent ?? 0), 0)
  const portfolioValue = properties.reduce((sum, p) => sum + (p.purchase_price ?? 0), 0)
  const avgYield = portfolioValue > 0 ? (expectedMonthly * 12 / portfolioValue) * 100 : null

  return {
    totalProperties: total,
    rentedCount: rented.length,
    vacantCount: vacant.length,
    maintenanceCount: maintenance.length,
    occupancyRate: total > 0 ? (rented.length / total) * 100 : null,
    monthlyRevenue,
    annualExpected: expectedMonthly * 12,
    portfolioValue,
    averageGrossYield: avgYield,
    lateCount: latePayments.length,
    lateAmount: latePayments.reduce((sum, p) => sum + p.amount, 0),
  }
}

export function DashboardOverview({
  properties,
  paidThisMonth,
  latePayments,
}: {
  properties: Property[]
  paidThisMonth: Payment[]
  latePayments: Payment[]
}) {
  const m = computeMetrics(properties, paidThisMonth, latePayments)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Nombre de biens"
        value={String(m.totalProperties)}
        subtitle={`${m.rentedCount} loue${m.rentedCount > 1 ? "s" : ""} · ${m.vacantCount} vacant${m.vacantCount > 1 ? "s" : ""}`}
        icon={Building2}
      />
      <StatsCard
        title="Taux d&apos;occupation"
        value={formatPercent(m.occupancyRate)}
        icon={PieChart}
      />
      <StatsCard
        title="Revenus ce mois"
        value={formatCurrency(m.monthlyRevenue)}
        subtitle={`${paidThisMonth.length} paiement${paidThisMonth.length > 1 ? "s" : ""} recu${paidThisMonth.length > 1 ? "s" : ""}`}
        icon={Wallet}
      />
      <StatsCard
        title="Valeur du patrimoine"
        value={formatCurrency(m.portfolioValue)}
        icon={Home}
      />
      <StatsCard
        title="Rendement brut moyen"
        value={formatPercent(m.averageGrossYield)}
        icon={TrendingUp}
      />
      <StatsCard
        title="Loyers en retard"
        value={m.lateCount > 0 ? `${m.lateCount} (${formatCurrency(m.lateAmount)})` : "0"}
        icon={AlertTriangle}
      />
    </div>
  )
}
