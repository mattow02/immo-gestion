"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TENANCY_STATUSES, formatCurrency } from "@/lib/constants"
import { endTenancy } from "@/app/(dashboard)/tenants/actions"
import { toast } from "sonner"
import type { Tenancy } from "@/lib/types/database"

type TenancyWithJoins = Tenancy & {
  property: { name: string | null; address: string; city: string } | null
  tenant: { full_name: string | null; email: string } | null
}

export function TenanciesTable({ tenancies }: { tenancies: TenancyWithJoins[] }) {
  const [endingId, setEndingId] = useState<string | null>(null)

  async function handleEnd(id: string) {
    const result = await endTenancy(id)
    setEndingId(null)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Bail termine")
    }
  }

  if (tenancies.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">Aucun locataire pour le moment.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Locataire</TableHead>
          <TableHead>Bien</TableHead>
          <TableHead>Loyer</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Debut</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenancies.map((t) => {
          const status = TENANCY_STATUSES.find((s) => s.value === t.status)
          return (
            <TableRow key={t.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{t.tenant?.full_name || "-"}</p>
                  <p className="text-xs text-muted-foreground">{t.tenant?.email}</p>
                </div>
              </TableCell>
              <TableCell>{t.property?.name || t.property?.address}</TableCell>
              <TableCell>{formatCurrency(t.rent_amount)}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={status?.color}>{status?.label}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{t.start_date}</TableCell>
              <TableCell>
                {t.status === "active" && (
                  <Dialog open={endingId === t.id} onOpenChange={(o) => setEndingId(o ? t.id : null)}>
                    <DialogTrigger render={<Button variant="outline" size="sm" />}>
                      Terminer
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Terminer ce bail ?</DialogTitle>
                        <DialogDescription>Le bail sera marque comme termine a la date du jour.</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEndingId(null)}>Annuler</Button>
                        <Button variant="destructive" onClick={() => handleEnd(t.id)}>Confirmer</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
