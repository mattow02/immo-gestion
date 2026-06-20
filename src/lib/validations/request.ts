import { z } from "zod"

export const requestSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  type: z.enum(["repair", "question", "complaint", "other"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
})

export type RequestFormData = z.infer<typeof requestSchema>
