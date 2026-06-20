"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { propertySchema } from "@/lib/validations/property"

function cleanNumeric(val: unknown): number | null {
  if (val === "" || val === undefined || val === null) return null
  const n = Number(val)
  return isNaN(n) ? null : n
}

export async function createProperty(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const raw = Object.fromEntries(formData)
  const parsed = propertySchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const d = parsed.data
  const { error } = await supabase.from("properties").insert({
    owner_id: user.id,
    name: d.name || null,
    address: d.address,
    city: d.city,
    postal_code: d.postal_code,
    surface_m2: cleanNumeric(d.surface_m2),
    rooms: cleanNumeric(d.rooms),
    property_type: d.property_type,
    floor: cleanNumeric(d.floor),
    year_built: cleanNumeric(d.year_built),
    purchase_price: cleanNumeric(d.purchase_price),
    current_rent: cleanNumeric(d.current_rent),
    charges_monthly: cleanNumeric(d.charges_monthly),
    tax_annual: cleanNumeric(d.tax_annual),
    dpe: d.dpe || null,
    status: d.status,
    notes: d.notes || null,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/properties")
  revalidatePath("/")
  redirect("/properties")
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const raw = Object.fromEntries(formData)
  const parsed = propertySchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const d = parsed.data
  const { error } = await supabase
    .from("properties")
    .update({
      name: d.name || null,
      address: d.address,
      city: d.city,
      postal_code: d.postal_code,
      surface_m2: cleanNumeric(d.surface_m2),
      rooms: cleanNumeric(d.rooms),
      property_type: d.property_type,
      floor: cleanNumeric(d.floor),
      year_built: cleanNumeric(d.year_built),
      purchase_price: cleanNumeric(d.purchase_price),
      current_rent: cleanNumeric(d.current_rent),
      charges_monthly: cleanNumeric(d.charges_monthly),
      tax_annual: cleanNumeric(d.tax_annual),
      dpe: d.dpe || null,
      status: d.status,
      notes: d.notes || null,
    })
    .eq("id", id)
    .eq("owner_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/properties/${id}`)
  revalidatePath("/properties")
  revalidatePath("/")
  redirect(`/properties/${id}`)
}

export async function deleteProperty(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/properties")
  revalidatePath("/")
  redirect("/properties")
}
