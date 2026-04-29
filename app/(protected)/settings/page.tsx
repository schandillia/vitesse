import { GatedPageTitle } from "@/components/layout/gated-page-title"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.settings.title,
  description: siteConfig.seo.metaData.settings.description,
  robots: siteConfig.seo.metaData.settings.robots,
}

export default async function SettingsPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  return (
    <div className="container">
      <GatedPageTitle
        title="Settings"
        description="Configure your account preferences and settings."
      />
    </div>
  )
}
