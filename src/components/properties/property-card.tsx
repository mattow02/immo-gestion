import Link from "next/link"
import { MapPin, Maximize2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PROPERTY_STATUSES, PROPERTY_TYPES, formatCurrency, computeGrossYield, formatPercent } from "@/lib/constants"
import type { Property } from "@/lib/types/database"

export function PropertyCard({ property }: { property: Property }) {
  const status = PROPERTY_STATUSES.find((s) => s.value === property.status)
  const type = PROPERTY_TYPES.find((t) => t.value === property.property_type)
  const grossYield = computeGrossYield(property.current_rent, property.purchase_price)

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <h3 className="font-semibold truncate">
                {property.name || property.address}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{property.city} ({property.postal_code})</span>
              </div>
            </div>
            <Badge variant="secondary" className={status?.color}>
              {status?.label}
            </Badge>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">{type?.label}</span>
            {property.surface_m2 && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Maximize2 className="h-3.5 w-3.5" />
                {property.surface_m2} m2
              </span>
            )}
            {property.rooms && (
              <span className="text-muted-foreground">
                {property.rooms}p
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t pt-3">
            <div>
              <p className="text-xs text-muted-foreground">Loyer</p>
              <p className="font-semibold">{formatCurrency(property.current_rent)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Rendement brut</p>
              <p className="font-semibold">{formatPercent(grossYield)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
