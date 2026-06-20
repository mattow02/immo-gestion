import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateQuittancePdf } from "@/lib/pdf/quittance"
import { formatMonth } from "@/lib/constants"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ paymentId: string }> },
) {
  const { paymentId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifie" }, { status: 401 })

  const { data: payment } = await supabase
    .from("payments")
    .select(`
      *,
      tenancy:tenancies(
        *,
        property:properties(*, owner:profiles!properties_owner_id_fkey(full_name)),
        tenant:profiles(full_name, email)
      )
    `)
    .eq("id", paymentId)
    .single()

  if (!payment) return NextResponse.json({ error: "Paiement non trouve" }, { status: 404 })
  if (payment.status !== "paid") return NextResponse.json({ error: "Paiement non paye" }, { status: 400 })

  const tenancy = payment.tenancy as {
    property: { address: string; city: string; owner: { full_name: string | null } | null } | null
    tenant: { full_name: string | null; email: string } | null
  } | null

  const pdf = generateQuittancePdf({
    tenantName: tenancy?.tenant?.full_name || "Locataire",
    tenantEmail: tenancy?.tenant?.email || "",
    ownerName: tenancy?.property?.owner?.full_name || "Proprietaire",
    propertyAddress: tenancy?.property?.address || "",
    propertyCity: tenancy?.property?.city || "",
    amount: payment.amount,
    dueDate: payment.due_date,
    paidDate: payment.paid_date!,
    paymentMethod: payment.payment_method,
  })

  const filename = `quittance_${formatMonth(payment.due_date).replace(/ /g, "_")}.pdf`

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
