export const PROPERTY_TYPES = [
  { value: "apartment", label: "Appartement" },
  { value: "house", label: "Maison" },
  { value: "studio", label: "Studio" },
  { value: "building", label: "Immeuble" },
] as const

export const PROPERTY_STATUSES = [
  { value: "rented", label: "Loue", color: "bg-emerald-100 text-emerald-800" },
  { value: "vacant", label: "Vacant", color: "bg-amber-100 text-amber-800" },
  { value: "maintenance", label: "Travaux", color: "bg-red-100 text-red-800" },
] as const

export const DPE_OPTIONS = ["A", "B", "C", "D", "E", "F", "G"] as const

export const DPE_COLORS: Record<string, string> = {
  A: "bg-green-500",
  B: "bg-lime-500",
  C: "bg-yellow-400",
  D: "bg-orange-400",
  E: "bg-orange-500",
  F: "bg-red-400",
  G: "bg-red-600",
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "-"
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null) return "-"
  return `${value.toFixed(1)}%`
}

export function computeGrossYield(rent: number | null, price: number | null): number | null {
  if (!rent || !price || price === 0) return null
  return (rent * 12 / price) * 100
}

export const REQUEST_TYPES = [
  { value: "repair", label: "Reparation" },
  { value: "question", label: "Question" },
  { value: "complaint", label: "Reclamation" },
  { value: "other", label: "Autre" },
] as const

export const REQUEST_STATUSES = [
  { value: "open", label: "Ouvert", color: "bg-blue-100 text-blue-800" },
  { value: "in_progress", label: "En cours", color: "bg-amber-100 text-amber-800" },
  { value: "resolved", label: "Resolu", color: "bg-emerald-100 text-emerald-800" },
  { value: "closed", label: "Ferme", color: "bg-gray-100 text-gray-800" },
] as const

export const REQUEST_PRIORITIES = [
  { value: "low", label: "Basse", color: "bg-gray-100 text-gray-700" },
  { value: "medium", label: "Moyenne", color: "bg-blue-100 text-blue-700" },
  { value: "high", label: "Haute", color: "bg-orange-100 text-orange-700" },
  { value: "urgent", label: "Urgente", color: "bg-red-100 text-red-700" },
] as const

export const TENANCY_STATUSES = [
  { value: "active", label: "Actif", color: "bg-emerald-100 text-emerald-800" },
  { value: "ended", label: "Termine", color: "bg-gray-100 text-gray-800" },
  { value: "pending", label: "En attente", color: "bg-amber-100 text-amber-800" },
] as const

export function computeNetYield(
  rent: number | null,
  charges: number | null,
  tax: number | null,
  price: number | null,
): number | null {
  if (!rent || !price || price === 0) return null
  const annualRent = rent * 12
  const annualCharges = (charges ?? 0) * 12
  const annualTax = tax ?? 0
  return ((annualRent - annualCharges - annualTax) / price) * 100
}
