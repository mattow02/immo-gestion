import { z } from "zod"

export const propertySchema = z.object({
  name: z.string().optional(),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  postal_code: z.string().min(1, "Le code postal est requis"),
  surface_m2: z.coerce.number().positive("La surface doit etre positive").optional().or(z.literal("")),
  rooms: z.coerce.number().int().positive("Le nombre de pieces doit etre positif").optional().or(z.literal("")),
  property_type: z.enum(["apartment", "house", "studio", "building"]),
  floor: z.coerce.number().int().min(0).optional().or(z.literal("")),
  year_built: z.coerce.number().int().min(1800).max(2030).optional().or(z.literal("")),
  purchase_price: z.coerce.number().positive("Le prix doit etre positif").optional().or(z.literal("")),
  current_rent: z.coerce.number().min(0, "Le loyer doit etre positif").optional().or(z.literal("")),
  charges_monthly: z.coerce.number().min(0).optional().or(z.literal("")),
  tax_annual: z.coerce.number().min(0).optional().or(z.literal("")),
  dpe: z.enum(["A", "B", "C", "D", "E", "F", "G", ""]).optional(),
  status: z.enum(["rented", "vacant", "maintenance"]),
  notes: z.string().optional(),
})

export type PropertyFormData = z.infer<typeof propertySchema>
