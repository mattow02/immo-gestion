"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PAYMENT_METHODS } from "@/lib/constants"
import { updatePaymentStatus } from "@/app/(dashboard)/payments/actions"
import { toast } from "sonner"

export function MarkPaidDialog({ paymentId, trigger }: { paymentId: string; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split("T")[0])
  const [method, setMethod] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    const result = await updatePaymentStatus(paymentId, "paid", paidDate, method || undefined)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Paiement marque comme paye")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<span className="cursor-pointer" />}>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marquer comme paye</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paidDate">Date de paiement</Label>
            <Input id="paidDate" type="date" value={paidDate} onChange={(e) => setPaidDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="method">Methode de paiement</Label>
            <select
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Non renseigne</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "..." : "Confirmer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
