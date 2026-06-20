import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { REQUEST_STATUSES, REQUEST_TYPES, REQUEST_PRIORITIES } from "@/lib/constants"
import type { MaintenanceRequest } from "@/lib/types/database"

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("requests")
    .select("*, property:properties(name, address), tenant:profiles(full_name, email)")
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data } = await query
  const requests = (data ?? []) as (MaintenanceRequest & {
    property: { name: string | null; address: string } | null
    tenant: { full_name: string | null; email: string } | null
  })[]

  const filters = [
    { value: "all", label: "Toutes" },
    { value: "open", label: "Ouvertes" },
    { value: "in_progress", label: "En cours" },
    { value: "resolved", label: "Resolues" },
    { value: "closed", label: "Fermees" },
  ]

  const currentFilter = status || "all"

  return (
    <>
      <Header title="Demandes" />
      <div className="p-6 space-y-6">
        <div className="flex gap-2">
          {filters.map((f) => (
            <Link key={f.value} href={f.value === "all" ? "/requests" : `/requests?status=${f.value}`}>
              <Button variant={currentFilter === f.value ? "default" : "outline"} size="sm">
                {f.label}
              </Button>
            </Link>
          ))}
        </div>

        {requests.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">Aucune demande.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Bien</TableHead>
                <TableHead>Locataire</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priorite</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => {
                const reqStatus = REQUEST_STATUSES.find((s) => s.value === r.status)
                const reqType = REQUEST_TYPES.find((t) => t.value === r.type)
                const reqPriority = REQUEST_PRIORITIES.find((p) => p.value === r.priority)
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Link href={`/requests/${r.id}`} className="font-medium hover:underline">
                        {r.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.property?.name || r.property?.address}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.tenant?.full_name || r.tenant?.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{reqType?.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={reqPriority?.color}>{reqPriority?.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={reqStatus?.color}>{reqStatus?.label}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(r.created_at).toLocaleDateString("fr-FR")}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  )
}
