import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { TenantMobileNav } from "@/components/layout/tenant-mobile-nav"
import { Button } from "@/components/ui/button"
import { RequestForm } from "@/components/tenant/request-form"
import { createRequest } from "../actions"

export default async function NewRequestPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: tenancy } = await supabase
    .from("tenancies")
    .select("id, property_id")
    .eq("tenant_id", user!.id)
    .eq("status", "active")
    .single()

  if (!tenancy) redirect("/tenant")

  return (
    <>
      <Header mobileNav={<TenantMobileNav />} />
      <div className="p-6 max-w-3xl space-y-4">
        <div className="flex items-center gap-3">
          <Link href="/tenant/requests">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Nouvelle demande</h1>
        </div>
        <RequestForm
          action={createRequest}
          propertyId={tenancy.property_id}
          tenancyId={tenancy.id}
        />
      </div>
    </>
  )
}
