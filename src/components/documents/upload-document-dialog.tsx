"use client"

import { useState } from "react"
import { Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DOCUMENT_TYPES } from "@/lib/constants"
import { uploadDocument } from "@/app/(dashboard)/documents/actions"
import { toast } from "sonner"

type Props = {
  properties: { id: string; name: string | null; address: string }[]
  tenancies?: { id: string; property_id: string; tenant: { full_name: string | null } | null }[]
}

export function UploadDocumentDialog({ properties, tenancies = [] }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [propertyId, setPropertyId] = useState("")

  const filteredTenancies = tenancies.filter((t) => t.property_id === propertyId)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await uploadDocument(formData)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Document ajoute")
      setOpen(false)
      setPropertyId("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un document
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Bien *</Label>
            <select
              name="property_id"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Choisir un bien</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name || p.address}</option>
              ))}
            </select>
          </div>
          {filteredTenancies.length > 0 && (
            <div className="space-y-2">
              <Label>Bail (optionnel)</Label>
              <select name="tenancy_id" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Aucun</option>
                {filteredTenancies.map((t) => (
                  <option key={t.id} value={t.id}>{t.tenant?.full_name || "Locataire"}</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type *</Label>
              <select name="type" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {DOCUMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input name="name" required placeholder="Ex: Bail appartement" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Fichier *</Label>
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <Input name="file" type="file" required accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
            </div>
            <p className="text-xs text-muted-foreground">Max 10 Mo. PDF, images ou documents Word.</p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Envoi..." : "Ajouter"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
