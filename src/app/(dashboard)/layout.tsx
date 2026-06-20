import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { count } = await supabase
    .from("requests")
    .select("*", { count: "exact", head: true })
    .in("status", ["open", "in_progress"])

  return (
    <div className="flex min-h-screen">
      <Sidebar requestCount={count ?? 0} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
