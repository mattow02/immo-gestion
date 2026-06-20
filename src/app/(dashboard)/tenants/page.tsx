import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TenanciesTable } from "@/components/tenants/tenancies-table"
import { InvitationsTable } from "@/components/tenants/invitations-table"
import { CreateInvitationDialog } from "@/components/tenants/create-invitation-dialog"

export default async function TenantsPage() {
  const supabase = await createClient()

  const [tenanciesRes, invitationsRes, propertiesRes] = await Promise.all([
    supabase
      .from("tenancies")
      .select("*, property:properties(name, address, city), tenant:profiles(full_name, email)")
      .order("created_at", { ascending: false }),
    supabase
      .from("invitation_codes")
      .select("*, property:properties(name, address)")
      .order("created_at", { ascending: false }),
    supabase
      .from("properties")
      .select("id, name, address"),
  ])

  return (
    <>
      <Header title="Locataires" />
      <div className="p-6 space-y-6">
        <Tabs defaultValue="tenancies">
          <div className="flex items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="tenancies">Locataires</TabsTrigger>
              <TabsTrigger value="invitations">Codes d&apos;invitation</TabsTrigger>
            </TabsList>
            <CreateInvitationDialog properties={propertiesRes.data ?? []} />
          </div>
          <TabsContent value="tenancies" className="mt-4">
            <TenanciesTable tenancies={(tenanciesRes.data ?? []) as never[]} />
          </TabsContent>
          <TabsContent value="invitations" className="mt-4">
            <InvitationsTable invitations={(invitationsRes.data ?? []) as never[]} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
