import Link from "next/link"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/properties/property-card"
import type { Property } from "@/lib/types/database"

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data: properties } = await query
  const props = (properties ?? []) as Property[]

  const filters = [
    { value: "all", label: "Tous" },
    { value: "rented", label: "Loues" },
    { value: "vacant", label: "Vacants" },
    { value: "maintenance", label: "Travaux" },
  ]

  const currentFilter = status || "all"

  return (
    <>
      <Header title="Mes biens" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {filters.map((f) => (
              <Link
                key={f.value}
                href={f.value === "all" ? "/properties" : `/properties?status=${f.value}`}
              >
                <Button
                  variant={currentFilter === f.value ? "default" : "outline"}
                  size="sm"
                >
                  {f.label}
                </Button>
              </Link>
            ))}
          </div>
          <Link href="/properties/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un bien
            </Button>
          </Link>
        </div>

        {props.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun bien trouve.</p>
            <Link href="/properties/new">
              <Button className="mt-4">Ajouter votre premier bien</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {props.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
