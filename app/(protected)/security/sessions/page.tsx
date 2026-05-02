import { getSessions } from "@/actions/get-sessions"
import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { SessionManagement } from "@/app/(protected)/security/sessions/components/session-management"
import { LogOutEverywhereButton } from "@/app/(protected)/security/sessions/components/log-out-everywhere-button"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.security.sessions.title,
  description: siteConfig.seo.metaData.security.sessions.description,
  robots: siteConfig.seo.metaData.security.sessions.robots,
}

export default async function SecuritySessionsPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  const sessionsResult = await getSessions()

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Sessions"
        description="Manage your active sessions and devices"
      />
      {sessionsResult.success && (
        <SessionManagement
          initialSessions={sessionsResult.sessions}
          currentToken={sessionsResult.currentToken}
        />
      )}
      <LogOutEverywhereButton />
    </div>
  )
}
