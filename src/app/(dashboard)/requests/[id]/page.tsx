import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, User } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { REQUEST_TYPES, REQUEST_PRIORITIES } from "@/lib/constants"
import { StatusUpdateDropdown } from "@/components/requests/status-update-dropdown"

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from("requests")
    .select("*, property:properties(name, address, city), tenant:profiles(full_name, email, phone)")
    .eq("id", id)
    .single()

  if (!data) notFound()

  const r = data as {
    id: string; title: string; description: string | null; type: string; priority: string;
    status: string; created_at: string; resolved_at: string | null;
    property: { name: string | null; address: string; city: string } | null;
    tenant: { full_name: string | null; email: string; phone: string | null } | null;
  }

  const reqType = REQUEST_TYPES.find((t) => t.value === r.type)
  const reqPriority = REQUEST_PRIORITIES.find((p) => p.value === r.priority)

  return (
    <>
      <Header />
      <div className="p-6 max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/requests">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{r.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Soumise le {new Date(r.created_at).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{reqType?.label}</Badge>
          <Badge variant="secondary" className={reqPriority?.color}>{reqPriority?.label}</Badge>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Statut</CardTitle>
              <StatusUpdateDropdown requestId={r.id} currentStatus={r.status} />
            </div>
          </CardHeader>
          {r.resolved_at && (
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Resolue le {new Date(r.resolved_at).toLocaleDateString("fr-FR")}
              </p>
            </CardContent>
          )}
        </Card>

        {r.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{r.description}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bien concerne</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {r.property?.name || r.property?.address}
              </div>
              <p className="text-sm text-muted-foreground">{r.property?.address}, {r.property?.city}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Locataire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                {r.tenant?.full_name || "-"}
              </div>
              <p className="text-sm text-muted-foreground">{r.tenant?.email}</p>
              {r.tenant?.phone && (
                <p className="text-sm text-muted-foreground">{r.tenant?.phone}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
