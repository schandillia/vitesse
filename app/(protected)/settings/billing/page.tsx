import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { SubscriptionActionsCard } from "@/app/(protected)/settings/billing/components/subscription-actions-card"
import { CurrentPlanCard } from "@/app/(protected)/settings/billing/components/current-plan-card"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import { getCurrentSubscription } from "@/actions/get-current-subscription"
import { TIERS } from "@/config/pricing"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { TierKey } from "@/db/types/payments/tier"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.settings.billing.title,
  description: siteConfig.seo.metaData.settings.billing.description,
  robots: siteConfig.seo.metaData.settings.billing.robots,
}

export default async function SettingsBillingPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  const result = await getCurrentSubscription()
  const subscription = result.success ? result.subscription : null

  const tier = TIERS[(subscription?.tier ?? "starter") as TierKey]

  const displayStatus = subscription?.cancelAtPeriodEnd ? "canceling" : "active"

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Billing"
        description="Manage your subscription, invoices, and billing preferences"
      />
      <CurrentPlanCard
        planName={tier.name}
        status={displayStatus}
        renewsAt={subscription?.currentPeriodEnd}
        cancelAtPeriodEnd={subscription?.cancelAtPeriodEnd ?? false}
      />
      <SubscriptionActionsCard
        tier={subscription?.tier ?? "starter"}
        provider={subscription?.provider ?? null}
        cancelAtPeriodEnd={subscription?.cancelAtPeriodEnd ?? false}
        providerSubscriptionId={subscription?.providerSubscriptionId ?? ""}
      />
    </div>
  )
}
