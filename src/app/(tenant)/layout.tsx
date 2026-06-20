import { TenantSidebar } from "@/components/layout/tenant-sidebar"

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <TenantSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
