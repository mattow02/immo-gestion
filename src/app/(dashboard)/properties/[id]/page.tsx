import { notFound } from "next/navigation"
import Link from "next/link"
import { Pencil, ArrowLeft, MapPin, Calendar, Layers, Maximize2 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  DPE_COLORS,
  formatCurrency,
  formatPercent,
  computeGrossYield,
  computeNetYield,
} from "@/lib/constants"
import { DeletePropertyButton } from "./delete-button"
import type { Property } from "@/lib/types/database"

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single()

  if (!data) notFound()

  const property = data as Property
  const status = PROPERTY_STATUSES.find((s) => s.value === property.status)
  const type = PROPERTY_TYPES.find((t) => t.value === property.property_type)
  const grossYield = computeGrossYield(property.current_rent, property.purchase_price)
  const netYield = computeNetYield(property.current_rent, property.charges_monthly, property.tax_annual, property.purchase_price)

  return (
    <>
      <Header />
      <div className="p-6 max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/properties">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{property.name || property.address}</h1>
            <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              {property.address}, {property.postal_code} {property.city}
            </div>
          </div>
          <Badge variant="secondary" className={status?.color + " text-sm"}>
            {status?.label}
          </Badge>
        </div>

        <div className="flex gap-3">
          <Link href={`/properties/${property.id}/edit`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </Link>
          <DeletePropertyButton propertyId={property.id} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Caracteristiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailRow label="Type" value={type?.label ?? "-"} icon={<Layers className="h-4 w-4" />} />
              {property.surface_m2 && (
                <DetailRow label="Surface" value={`${property.surface_m2} m2`} icon={<Maximize2 className="h-4 w-4" />} />
              )}
              {property.rooms && <DetailRow label="Pieces" value={String(property.rooms)} />}
              {property.floor != null && <DetailRow label="Etage" value={String(property.floor)} />}
              {property.year_built && (
                <DetailRow label="Annee" value={String(property.year_built)} icon={<Calendar className="h-4 w-4" />} />
              )}
              {property.dpe && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">DPE</span>
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded text-sm font-bold text-white ${DPE_COLORS[property.dpe]}`}>
                    {property.dpe}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailRow label="Prix d'achat" value={formatCurrency(property.purchase_price)} />
              <DetailRow label="Loyer mensuel" value={formatCurrency(property.current_rent)} />
              <DetailRow label="Charges mensuelles" value={formatCurrency(property.charges_monthly)} />
              <DetailRow label="Taxe fonciere" value={formatCurrency(property.tax_annual)} />
              <Separator />
              <DetailRow label="Rendement brut" value={formatPercent(grossYield)} highlight />
              <DetailRow label="Rendement net" value={formatPercent(netYield)} highlight />
            </CardContent>
          </Card>
        </div>

        {property.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{property.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

function DetailRow({
  label,
  value,
  icon,
  highlight,
}: {
  label: string
  value: string
  icon?: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className={highlight ? "font-semibold text-primary" : "text-sm font-medium"}>
        {value}
      </span>
    </div>
  )
}
