import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PROPERTY_STATUSES, formatCurrency, computeGrossYield, formatPercent } from "@/lib/constants"
import type { Property } from "@/lib/types/database"

export function PropertiesSummary({ properties }: { properties: Property[] }) {
  const recent = properties.slice(0, 5)

  if (recent.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Derniers biens ajoutes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucun bien pour le moment.{" "}
            <Link href="/properties/new" className="text-primary hover:underline">
              Ajouter un bien
            </Link>
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Derniers biens ajoutes</CardTitle>
        <Link
          href="/properties"
          className="text-sm text-primary hover:underline"
        >
          Voir tout
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bien</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Loyer</TableHead>
              <TableHead className="text-right">Rendement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((property) => {
              const status = PROPERTY_STATUSES.find((s) => s.value === property.status)
              const grossYield = computeGrossYield(property.current_rent, property.purchase_price)
              return (
                <TableRow key={property.id}>
                  <TableCell>
                    <Link
                      href={`/properties/${property.id}`}
                      className="font-medium hover:underline"
                    >
                      {property.name || property.address}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {property.city}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={status?.color}>
                      {status?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(property.current_rent)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercent(grossYield)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
