import { Download } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { TenantMobileNav } from "@/components/layout/tenant-mobile-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DOCUMENT_TYPES, formatDate } from "@/lib/constants"
import type { Document } from "@/lib/types/database"

export default async function TenantDocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: tenancy } = await supabase
    .from("tenancies")
    .select("id")
    .eq("tenant_id", user!.id)
    .eq("status", "active")
    .single()

  let documents: Document[] = []
  if (tenancy) {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("tenancy_id", tenancy.id)
      .order("uploaded_at", { ascending: false })
    documents = (data ?? []) as Document[]
  }

  return (
    <>
      <Header title="Mes documents" mobileNav={<TenantMobileNav />} />
      <div className="p-6 space-y-4">
        {documents.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">Aucun document disponible.</p>
        ) : (
          documents.map((doc) => {
            const docType = DOCUMENT_TYPES.find((t) => t.value === doc.type)
            return (
              <Card key={doc.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{docType?.label}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(doc.uploaded_at)}</span>
                    </div>
                  </div>
                  <a href={`/api/documents/${doc.id}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Telecharger
                    </Button>
                  </a>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </>
  )
}
