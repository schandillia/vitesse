import { getSessions } from "@/actions/get-sessions"
import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { PasskeyManagement } from "@/app/(protected)/security/components/passkey-management"
import { SessionManagement } from "@/app/(protected)/security/components/session-management"
import { LogOutEverywhereButton } from "@/app/(protected)/settings/components/log-out-everywhere-button"
import { siteConfig } from "@/config/site"
import { auth } from "@/lib/auth/auth"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.security.title,
  description: siteConfig.seo.metaData.security.description,
  robots: siteConfig.seo.metaData.security.robots,
}

export default async function SecurityGeneralPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  const sessionsResult = await getSessions()

  const passkeys = await auth.api.listPasskeys({ headers: await headers() })

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Security"
        description="Manage your passkeys and active sessions"
      />
      <PasskeyManagement passkeys={passkeys} />
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
