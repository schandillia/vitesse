import { ProtectedPageTitle } from "@/app/(protected)/components/protected-page-title"
import { LogOutEverywhereButton } from "@/app/(protected)/settings/components/log-out-everywhere-button"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.settings.title,
  description: siteConfig.seo.metaData.settings.description,
}

export default async function SettingsPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  return (
    <div className="container">
      <ProtectedPageTitle title="Settings" />
      <LogOutEverywhereButton />
    </div>
  )
}
