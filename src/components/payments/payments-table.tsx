"use client"

import { Trash2, FileDown, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PaymentStatusBadge } from "./payment-status-badge"
import { MarkPaidDialog } from "./mark-paid-dialog"
import { formatCurrency, formatDate, PAYMENT_METHODS, getEffectivePaymentStatus } from "@/lib/constants"
import { deletePayment } from "@/app/(dashboard)/payments/actions"
import { toast } from "sonner"
import type { Payment } from "@/lib/types/database"

type PaymentRow = Payment & {
  tenancy: {
    property: { name: string | null; address: string } | null
    tenant: { full_name: string | null; email: string } | null
  } | null
}

export function PaymentsTable({ payments }: { payments: PaymentRow[] }) {
  async function handleDelete(id: string) {
    const result = await deletePayment(id)
    if (result?.error) toast.error(result.error)
    else toast.success("Paiement supprime")
  }

  if (payments.length === 0) {
    return <p className="text-center py-12 text-muted-foreground">Aucun paiement.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Locataire</TableHead>
          <TableHead>Bien</TableHead>
          <TableHead className="text-right">Montant</TableHead>
          <TableHead>Echeance</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Methode</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((p) => {
          const method = PAYMENT_METHODS.find((m) => m.value === p.payment_method)
          const effective = getEffectivePaymentStatus(p.status, p.due_date)
          return (
            <TableRow key={p.id}>
              <TableCell>{p.tenancy?.tenant?.full_name || p.tenancy?.tenant?.email || "-"}</TableCell>
              <TableCell className="text-muted-foreground">{p.tenancy?.property?.name || p.tenancy?.property?.address || "-"}</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(p.amount)}</TableCell>
              <TableCell className="text-muted-foreground">{formatDate(p.due_date)}</TableCell>
              <TableCell><PaymentStatusBadge status={p.status} dueDate={p.due_date} /></TableCell>
              <TableCell className="text-muted-foreground">{method?.label || "-"}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {effective !== "paid" && (
                    <MarkPaidDialog
                      paymentId={p.id}
                      trigger={<Button variant="ghost" size="icon" title="Marquer paye"><CheckCircle className="h-4 w-4" /></Button>}
                    />
                  )}
                  {p.status === "paid" && (
                    <a href={`/api/quittance/${p.id}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" title="Quittance PDF"><FileDown className="h-4 w-4" /></Button>
                    </a>
                  )}
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)} title="Supprimer">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
