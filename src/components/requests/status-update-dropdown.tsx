"use client"

import { useState } from "react"
import { REQUEST_STATUSES } from "@/lib/constants"
import { updateRequestStatus } from "@/app/(dashboard)/requests/actions"
import { toast } from "sonner"

export function StatusUpdateDropdown({ requestId, currentStatus }: { requestId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    if (newStatus === currentStatus) return
    setLoading(true)
    const result = await updateRequestStatus(requestId, newStatus)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Statut mis a jour")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={loading}
        className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
      >
        {REQUEST_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      {loading && <span className="text-xs text-muted-foreground">...</span>}
    </div>
  )
}
