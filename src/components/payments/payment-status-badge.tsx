import { Badge } from "@/components/ui/badge"
import { PAYMENT_STATUSES, getEffectivePaymentStatus } from "@/lib/constants"

export function PaymentStatusBadge({ status, dueDate }: { status: string; dueDate: string }) {
  const effective = getEffectivePaymentStatus(status, dueDate)
  const s = PAYMENT_STATUSES.find((p) => p.value === effective)
  return <Badge variant="secondary" className={s?.color}>{s?.label}</Badge>
}
