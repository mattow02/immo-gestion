import Link from "next/link"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { TenantMobileNav } from "@/components/layout/tenant-mobile-nav"
import { Button } from "@/components/ui/button"
import { TenantPropertyCard } from "@/components/tenant/tenant-property-card"
import { TenantOverview } from "@/components/tenant/tenant-overview"
import { RecentRequests } from "@/components/tenant/recent-requests"
import type { Property, Tenancy, MaintenanceRequest } from "@/lib/types/database"

export default async function TenantDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: tenancy } = await supabase
    .from("tenancies")
    .select("*, property:properties(*)")
    .eq("tenant_id", user!.id)
    .eq("status", "active")
    .single()

  const { data: requests } = await supabase
    .from("requests")
    .select("*")
    .eq("tenant_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const { count: openCount } = await supabase
    .from("requests")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", user!.id)
    .in("status", ["open", "in_progress"])

  const t = tenancy as (Tenancy & { property: Property }) | null
  const reqs = (requests ?? []) as MaintenanceRequest[]

  return (
    <>
      <Header title="Mon espace" mobileNav={<TenantMobileNav />} />
      <div className="p-6 space-y-6">
        {t ? (
          <>
            <TenantOverview tenancy={t} openRequestsCount={openCount ?? 0} />
            <TenantPropertyCard property={t.property} />
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Mes demandes recentes</h2>
              <Link href="/tenant/requests/new">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle demande
                </Button>
              </Link>
            </div>
            <RecentRequests requests={reqs} />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun bail actif.</p>
          </div>
        )}
      </div>
    </>
  )
}
