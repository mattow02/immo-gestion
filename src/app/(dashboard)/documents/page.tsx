import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { DocumentsTable } from "@/components/documents/documents-table"
import { UploadDocumentDialog } from "@/components/documents/upload-document-dialog"

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("documents")
    .select("*, property:properties(name, address)")
    .order("uploaded_at", { ascending: false })

  if (type && type !== "all") {
    query = query.eq("type", type)
  }

  const { data: documents } = await query

  const { data: properties } = await supabase.from("properties").select("id, name, address")
  const { data: tenancies } = await supabase
    .from("tenancies")
    .select("id, property_id, tenant:profiles(full_name)")
    .eq("status", "active")

  const filters = [
    { value: "all", label: "Tous" },
    { value: "bail", label: "Bail" },
    { value: "etat_des_lieux", label: "Etat des lieux" },
    { value: "quittance", label: "Quittance" },
    { value: "assurance", label: "Assurance" },
    { value: "autre", label: "Autre" },
  ]
  const currentFilter = type || "all"

  return (
    <>
      <Header title="Documents" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <Link key={f.value} href={f.value === "all" ? "/documents" : `/documents?type=${f.value}`}>
                <Button variant={currentFilter === f.value ? "default" : "outline"} size="sm">{f.label}</Button>
              </Link>
            ))}
          </div>
          <UploadDocumentDialog properties={properties ?? []} tenancies={(tenancies ?? []) as never[]} />
        </div>
        <DocumentsTable documents={(documents ?? []) as never[]} />
      </div>
    </>
  )
}
