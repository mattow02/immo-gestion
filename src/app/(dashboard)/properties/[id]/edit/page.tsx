import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { PropertyForm } from "@/components/properties/property-form"
import { updateProperty } from "../../actions"
import type { Property } from "@/lib/types/database"

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single()

  if (!data) notFound()

  const property = data as Property

  async function handleUpdate(formData: FormData) {
    "use server"
    return updateProperty(id, formData)
  }

  return (
    <>
      <Header />
      <div className="p-6 max-w-3xl space-y-4">
        <div className="flex items-center gap-3">
          <Link href={`/properties/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Modifier le bien</h1>
        </div>
        <PropertyForm
          action={handleUpdate}
          defaultValues={property}
          submitLabel="Enregistrer les modifications"
        />
      </div>
    </>
  )
}
