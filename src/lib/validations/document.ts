import { z } from "zod"

export const documentSchema = z.object({
  property_id: z.string().min(1, "Le bien est requis"),
  tenancy_id: z.string().optional(),
  type: z.enum(["bail", "etat_des_lieux", "quittance", "assurance", "autre"]),
  name: z.string().min(1, "Le nom est requis"),
})
