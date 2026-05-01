import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/get-server-session"
import { PostHogIdentify } from "@/components/analytics/posthog-identify"
import { SecurityPageSidebar } from "@/app/(protected)/security/components/security-page-sidebar"

export default async function ProtectedSecurityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      <PostHogIdentify userId={user.id} email={user.email} name={user.name} />
      <SecurityPageSidebar user={user} />
      <SidebarInset>
        {/* Top bar */}
        <div className="flex flex-1 flex-col gap-6 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
