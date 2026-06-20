"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PAYMENT_METHODS } from "@/lib/constants"
import { createPayment } from "@/app/(dashboard)/payments/actions"
import { toast } from "sonner"

type TenancyOption = {
  id: string
  rent_amount: number
  tenant: { full_name: string | null; email: string } | null
  property: { name: string | null; address: string } | null
}

export function CreatePaymentDialog({ tenancies }: { tenancies: TenancyOption[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedTenancy, setSelectedTenancy] = useState("")
  const [amount, setAmount] = useState("")

  function handleTenancyChange(id: string) {
    setSelectedTenancy(id)
    const t = tenancies.find((t) => t.id === id)
    if (t) setAmount(String(t.rent_amount))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await createPayment(formData)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Paiement cree")
      setOpen(false)
      setSelectedTenancy("")
      setAmount("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau paiement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Bail *</Label>
            <select
              name="tenancy_id"
              value={selectedTenancy}
              onChange={(e) => handleTenancyChange(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Choisir un bail</option>
              {tenancies.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.tenant?.full_name || t.tenant?.email} — {t.property?.name || t.property?.address}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Montant (EUR) *</Label>
              <Input name="amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Echeance *</Label>
              <Input name="due_date" type="date" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Statut</Label>
              <select name="status" defaultValue="pending" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="pending">En attente</option>
                <option value="paid">Paye</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Methode</Label>
              <select name="payment_method" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">-</option>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>
          <input type="hidden" name="paid_date" value="" />
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "..." : "Creer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
