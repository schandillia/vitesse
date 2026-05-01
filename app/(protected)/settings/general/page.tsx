import { getSessions } from "@/actions/get-sessions"
import { GatedPageTitle } from "@/components/layout/gated-page-title"
import { siteConfig } from "@/config/site"
import { auth } from "@/lib/auth/auth"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.settings.title,
  description: siteConfig.seo.metaData.settings.description,
  robots: siteConfig.seo.metaData.settings.robots,
}

export default async function SettingsGeneralPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  return (
    <div className="container space-y-5">
      <GatedPageTitle
        title="Settings"
        description="Manage your passkeys and active sessions"
      />
      <p>TBD</p>
    </div>
  )
}
