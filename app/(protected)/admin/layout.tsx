import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { redirect, unauthorized } from "next/navigation"
import { getServerSession } from "@/lib/auth/get-server-session"
import { PostHogIdentify } from "@/components/analytics/posthog-identify"
import { AdminPageSidebar } from "@/app/(protected)/admin/components/admin-page-sidebar"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }
  if (user.role !== "admin") {
    unauthorized()
  }

  return (
    <SidebarProvider>
      <PostHogIdentify userId={user.id} email={user.email} name={user.name} />
      <AdminPageSidebar user={user} />
      <SidebarInset>
        {/* Top bar */}
        <div className="flex flex-1 flex-col gap-6 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
