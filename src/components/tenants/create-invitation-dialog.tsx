"use client"

import { useState } from "react"
import { Plus, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { createInvitation } from "@/app/(dashboard)/tenants/actions"
import { toast } from "sonner"
import type { Property } from "@/lib/types/database"

export function CreateInvitationDialog({ properties }: { properties: Pick<Property, "id" | "name" | "address">[] }) {
  const [open, setOpen] = useState(false)
  const [propertyId, setPropertyId] = useState("")
  const [tenantEmail, setTenantEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleCreate() {
    if (!propertyId) return
    setLoading(true)
    const result = await createInvitation(propertyId, tenantEmail || undefined)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    if (result.code) {
      setGeneratedCode(result.code)
      toast.success("Code d'invitation cree")
    }
  }

  async function handleCopy() {
    if (!generatedCode) return
    await navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleClose(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      setPropertyId("")
      setTenantEmail("")
      setGeneratedCode(null)
      setCopied(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger render={<Button />}>
        <Plus className="h-4 w-4 mr-2" />
        Generer un code
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau code d&apos;invitation</DialogTitle>
          <DialogDescription>
            Generez un code pour inviter un locataire a rejoindre un de vos biens.
          </DialogDescription>
        </DialogHeader>

        {generatedCode ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Code d&apos;invitation</p>
              <p className="text-2xl font-mono font-bold tracking-wider">{generatedCode}</p>
            </div>
            <Button onClick={handleCopy} variant="outline" className="w-full">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copie !" : "Copier le code"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="property">Bien *</Label>
              <select
                id="property"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Choisir un bien</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name || p.address}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email du locataire (optionnel)</Label>
              <Input
                id="email"
                type="email"
                placeholder="locataire@exemple.fr"
                value={tenantEmail}
                onChange={(e) => setTenantEmail(e.target.value)}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {!generatedCode && (
            <Button onClick={handleCreate} disabled={!propertyId || loading}>
              {loading ? "Generation..." : "Generer"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
