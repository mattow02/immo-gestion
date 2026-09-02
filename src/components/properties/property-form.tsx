"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PROPERTY_TYPES, PROPERTY_STATUSES, DPE_OPTIONS } from "@/lib/constants"
import type { Property } from "@/lib/types/database"

type Props = {
  action: (formData: FormData) => Promise<{ error: string } | void>
  defaultValues?: Property
  submitLabel: string
}

export function PropertyForm({ action, defaultValues, submitLabel }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    try {
      const result = await action(formData)
      if (result?.error) {
        setError(result.error)
      }
    } catch {
      // redirect throws : expected
    } finally {
      setLoading(false)
    }
  }

  const d = defaultValues

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Localisation</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="name">Nom du bien (optionnel)</Label>
            <Input id="name" name="name" placeholder="ex: Studio Belleville" defaultValue={d?.name ?? ""} />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="address">Adresse *</Label>
            <Input id="address" name="address" required defaultValue={d?.address ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Ville *</Label>
            <Input id="city" name="city" required defaultValue={d?.city ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal_code">Code postal *</Label>
            <Input id="postal_code" name="postal_code" required defaultValue={d?.postal_code ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Caracteristiques</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="property_type">Type de bien</Label>
            <select
              id="property_type"
              name="property_type"
              defaultValue={d?.property_type ?? "apartment"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="surface_m2">Surface (m2)</Label>
            <Input id="surface_m2" name="surface_m2" type="number" step="0.1" min="0" defaultValue={d?.surface_m2 ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rooms">Pieces</Label>
            <Input id="rooms" name="rooms" type="number" min="1" defaultValue={d?.rooms ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="floor">Etage</Label>
            <Input id="floor" name="floor" type="number" min="0" defaultValue={d?.floor ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year_built">Annee de construction</Label>
            <Input id="year_built" name="year_built" type="number" min="1800" max="2030" defaultValue={d?.year_built ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dpe">DPE</Label>
            <select
              id="dpe"
              name="dpe"
              defaultValue={d?.dpe ?? ""}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Non renseigne</option>
              {DPE_OPTIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Financier</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="purchase_price">Prix d&apos;achat (EUR)</Label>
            <Input id="purchase_price" name="purchase_price" type="number" min="0" defaultValue={d?.purchase_price ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current_rent">Loyer mensuel (EUR)</Label>
            <Input id="current_rent" name="current_rent" type="number" min="0" defaultValue={d?.current_rent ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="charges_monthly">Charges mensuelles (EUR)</Label>
            <Input id="charges_monthly" name="charges_monthly" type="number" min="0" defaultValue={d?.charges_monthly ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax_annual">Taxe fonciere annuelle (EUR)</Label>
            <Input id="tax_annual" name="tax_annual" type="number" min="0" defaultValue={d?.tax_annual ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Statut & Notes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <select
              id="status"
              name="status"
              defaultValue={d?.status ?? "vacant"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {PROPERTY_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={d?.notes ?? ""}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
