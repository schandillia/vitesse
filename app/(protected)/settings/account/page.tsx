import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { ConnectedAccountsCard } from "@/app/(protected)/settings/account/components/connected-accounts-card"
import { DeleteAccountCard } from "@/app/(protected)/settings/account/components/delete-account-card"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import { getConnectedAccounts } from "@/actions/get-connected-accounts"
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

  const result = await getConnectedAccounts()
  const accounts = result.success ? result.accounts : []

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Account"
        description="Manage your sign-in methods and account deletion"
      />
      <ConnectedAccountsCard
        accounts={accounts}
        emailVerified={user.emailVerified}
      />
      <DeleteAccountCard username={user.username} />
    </div>
  )
}
