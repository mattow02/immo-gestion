import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { REQUEST_STATUSES, REQUEST_TYPES, REQUEST_PRIORITIES } from "@/lib/constants"
import type { MaintenanceRequest } from "@/lib/types/database"

export function RecentRequests({ requests }: { requests: MaintenanceRequest[] }) {
  if (requests.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Aucune demande pour le moment.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((r) => {
        const status = REQUEST_STATUSES.find((s) => s.value === r.status)
        const type = REQUEST_TYPES.find((t) => t.value === r.type)
        const priority = REQUEST_PRIORITIES.find((p) => p.value === r.priority)
        return (
          <Card key={r.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(r.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Badge variant="secondary">{type?.label}</Badge>
                  <Badge variant="secondary" className={priority?.color}>{priority?.label}</Badge>
                  <Badge variant="secondary" className={status?.color}>{status?.label}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
