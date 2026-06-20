import { z } from "zod"

export const paymentSchema = z.object({
  tenancy_id: z.string().min(1, "Le bail est requis"),
  amount: z.coerce.number().positive("Le montant doit etre positif"),
  due_date: z.string().min(1, "La date d'echeance est requise"),
  paid_date: z.string().optional(),
  status: z.enum(["paid", "pending", "late"]),
  payment_method: z.enum(["virement", "cheque", "especes", "autre", ""]).optional(),
  notes: z.string().optional(),
})

export const bulkPaymentSchema = z.object({
  tenancy_id: z.string().min(1, "Le bail est requis"),
  amount: z.coerce.number().positive("Le montant doit etre positif"),
  start_month: z.string().min(1, "Le mois de debut est requis"),
  end_month: z.string().min(1, "Le mois de fin est requis"),
})
