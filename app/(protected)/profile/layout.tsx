import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth/get-server-session"
import { PostHogIdentify } from "@/components/analytics/posthog-identify"
import { ProfilePageSidebar } from "@/app/(protected)/profile/components/profile-page-sidebar"

export default async function ProtectedProfileLayout({
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
      <ProfilePageSidebar user={user} />
      <SidebarInset>
        {/* Top bar */}
        <div className="flex flex-1 flex-col gap-6 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
