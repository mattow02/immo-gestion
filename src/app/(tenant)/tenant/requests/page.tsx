import Link from "next/link"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { TenantMobileNav } from "@/components/layout/tenant-mobile-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { REQUEST_STATUSES, REQUEST_TYPES, REQUEST_PRIORITIES } from "@/lib/constants"
import { ToastHandler } from "@/components/tenant/toast-handler"
import { DeleteRequestButton } from "./delete-button"
import type { MaintenanceRequest } from "@/lib/types/database"

export default async function TenantRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; created?: string }>
}) {
  const { status } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from("requests")
    .select("*")
    .eq("tenant_id", user!.id)
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data } = await query
  const requests = (data ?? []) as MaintenanceRequest[]

  const filters = [
    { value: "all", label: "Toutes" },
    { value: "open", label: "Ouvertes" },
    { value: "in_progress", label: "En cours" },
    { value: "resolved", label: "Resolues" },
  ]

  const currentFilter = status || "all"

  return (
    <>
      <Header title="Mes demandes" mobileNav={<TenantMobileNav />} />
      <ToastHandler paramKey="created" message="Demande soumise avec succes" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {filters.map((f) => (
              <Link key={f.value} href={f.value === "all" ? "/tenant/requests" : `/tenant/requests?status=${f.value}`}>
                <Button variant={currentFilter === f.value ? "default" : "outline"} size="sm">
                  {f.label}
                </Button>
              </Link>
            ))}
          </div>
          <Link href="/tenant/requests/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle demande
            </Button>
          </Link>
        </div>

        {requests.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">Aucune demande.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => {
              const reqStatus = REQUEST_STATUSES.find((s) => s.value === r.status)
              const reqType = REQUEST_TYPES.find((t) => t.value === r.type)
              const reqPriority = REQUEST_PRIORITIES.find((p) => p.value === r.priority)
              return (
                <Card key={r.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{r.title}</p>
                        {r.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(r.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex gap-1.5">
                          <Badge variant="secondary">{reqType?.label}</Badge>
                          <Badge variant="secondary" className={reqPriority?.color}>{reqPriority?.label}</Badge>
                          <Badge variant="secondary" className={reqStatus?.color}>{reqStatus?.label}</Badge>
                        </div>
                        {r.status === "open" && (
                          <DeleteRequestButton requestId={r.id} />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
