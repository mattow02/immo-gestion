import { Building2, TrendingUp, Wallet, PieChart, Home, Wrench } from "lucide-react"
import { StatsCard } from "./stats-card"
import { formatCurrency, formatPercent } from "@/lib/constants"
import type { Property } from "@/lib/types/database"

type DashboardMetrics = {
  totalProperties: number
  rentedCount: number
  vacantCount: number
  maintenanceCount: number
  occupancyRate: number | null
  monthlyRevenue: number
  annualRevenue: number
  portfolioValue: number
  averageGrossYield: number | null
}

function computeMetrics(properties: Property[]): DashboardMetrics {
  const total = properties.length
  const rented = properties.filter((p) => p.status === "rented")
  const vacant = properties.filter((p) => p.status === "vacant")
  const maintenance = properties.filter((p) => p.status === "maintenance")

  const monthlyRevenue = rented.reduce((sum, p) => sum + (p.current_rent ?? 0), 0)
  const portfolioValue = properties.reduce((sum, p) => sum + (p.purchase_price ?? 0), 0)

  const avgYield = portfolioValue > 0 ? (monthlyRevenue * 12 / portfolioValue) * 100 : null

  return {
    totalProperties: total,
    rentedCount: rented.length,
    vacantCount: vacant.length,
    maintenanceCount: maintenance.length,
    occupancyRate: total > 0 ? (rented.length / total) * 100 : null,
    monthlyRevenue,
    annualRevenue: monthlyRevenue * 12,
    portfolioValue,
    averageGrossYield: avgYield,
  }
}

export function DashboardOverview({ properties }: { properties: Property[] }) {
  const m = computeMetrics(properties)

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
        subtitle={m.maintenanceCount > 0 ? `${m.maintenanceCount} en travaux` : undefined}
        icon={PieChart}
      />
      <StatsCard
        title="Revenus mensuels"
        value={formatCurrency(m.monthlyRevenue)}
        subtitle={`${formatCurrency(m.annualRevenue)} / an`}
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
        title="Biens en travaux"
        value={String(m.maintenanceCount)}
        icon={Wrench}
      />
    </div>
  )
}
