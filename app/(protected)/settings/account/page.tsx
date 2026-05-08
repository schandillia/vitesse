import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.settings.account.title,
  description: siteConfig.seo.metaData.settings.account.description,
  robots: siteConfig.seo.metaData.settings.account.robots,
}

export default async function SettingsAccountPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  // const passkeys = await auth.api.listPasskeys({ headers: await headers() })

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Account"
        description="Manage your email, connected accounts, and account deletion"
      />
      <p>TBD</p>
    </div>
  )
}
