import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { BillingActionsCard } from "@/app/(protected)/settings/billing/components/billing-actions-card"
import { CurrentPlanCard } from "@/app/(protected)/settings/billing/components/current-plan-card"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

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

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Billing"
        description="Manage your subscription, invoices, and billing preferences"
      />
      <CurrentPlanCard
        planName="Pro"
        status="active"
        renewsAt={new Date("2026-06-14")}
        cancelAtPeriodEnd={false}
      />
      <BillingActionsCard
        canManageBilling
        canCancel
        canResume={false}
        cancelAtPeriodEnd={false}
        onManageBilling={async () => {
          "use server"
        }}
        onCancel={async () => {
          "use server"
        }}
        onResume={async () => {
          "use server"
        }}
      />
    </div>
  )
}
