import { MapPin, Maximize2, Layers, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PROPERTY_TYPES, DPE_COLORS } from "@/lib/constants"
import type { Property } from "@/lib/types/database"

export function TenantPropertyCard({ property }: { property: Property }) {
  const type = PROPERTY_TYPES.find((t) => t.value === property.property_type)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Mon logement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{property.address}, {property.postal_code} {property.city}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              {type?.label}
            </span>
            {property.surface_m2 && (
              <span className="flex items-center gap-1.5">
                <Maximize2 className="h-3.5 w-3.5" />
                {property.surface_m2} m2
              </span>
            )}
            {property.rooms && <span>{property.rooms} pieces</span>}
            {property.floor != null && <span>Etage {property.floor}</span>}
            {property.year_built && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {property.year_built}
              </span>
            )}
          </div>
          {property.dpe && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">DPE</span>
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded text-sm font-bold text-white ${DPE_COLORS[property.dpe]}`}>
                {property.dpe}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
