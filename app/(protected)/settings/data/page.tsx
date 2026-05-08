import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { ExportDataCard } from "@/app/(protected)/settings/data/components/export-data-card"
import { DataRightsCard } from "@/app/(protected)/settings/data/components/data-rights-card"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.settings.data.title,
  description: siteConfig.seo.metaData.settings.data.description,
  robots: siteConfig.seo.metaData.settings.data.robots,
}

export default async function SettingsDataPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Data"
        description="Export your data and manage your data rights"
      />
      <ExportDataCard username={user.username} />
      <DataRightsCard />
    </div>
  )
}
