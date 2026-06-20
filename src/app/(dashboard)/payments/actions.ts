"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { paymentSchema, bulkPaymentSchema } from "@/lib/validations/payment"

export async function createPayment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const raw = Object.fromEntries(formData)
  const parsed = paymentSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const d = parsed.data
  const { error } = await supabase.from("payments").insert({
    tenancy_id: d.tenancy_id,
    amount: d.amount,
    due_date: d.due_date,
    paid_date: d.paid_date || null,
    status: d.status,
    payment_method: d.payment_method || null,
    notes: d.notes || null,
  })

  if (error) return { error: error.message }
  revalidatePath("/payments")
  revalidatePath("/")
}

export async function createBulkPayments(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const raw = Object.fromEntries(formData)
  const parsed = bulkPaymentSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { tenancy_id, amount, start_month, end_month } = parsed.data
  const start = new Date(start_month + "-01")
  const end = new Date(end_month + "-01")

  if (start > end) return { error: "Le mois de debut doit etre avant le mois de fin" }

  const payments = []
  const current = new Date(start)
  while (current <= end) {
    payments.push({
      tenancy_id,
      amount,
      due_date: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-01`,
      status: "pending" as const,
    })
    current.setMonth(current.getMonth() + 1)
  }

  const { error } = await supabase.from("payments").insert(payments)
  if (error) return { error: error.message }

  revalidatePath("/payments")
  revalidatePath("/")
  return { count: payments.length }
}

export async function updatePaymentStatus(
  paymentId: string,
  status: string,
  paidDate?: string,
  paymentMethod?: string,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const updateData: Record<string, unknown> = { status }
  if (status === "paid") {
    updateData.paid_date = paidDate || new Date().toISOString().split("T")[0]
    if (paymentMethod) updateData.payment_method = paymentMethod
  }

  const { error } = await supabase
    .from("payments")
    .update(updateData)
    .eq("id", paymentId)

  if (error) return { error: error.message }
  revalidatePath("/payments")
  revalidatePath("/")
}

export async function deletePayment(paymentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifie")

  const { error } = await supabase.from("payments").delete().eq("id", paymentId)
  if (error) return { error: error.message }

  revalidatePath("/payments")
  revalidatePath("/")
}
