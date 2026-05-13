import { getServerSession } from "@/lib/auth/get-server-session"
import { getUserAccessLevel } from "@/lib/payments/subscription-state"
import type { TierKey } from "@/db/types/payments/tier"
import { PricingTable } from "@/app/(main)/pricing/components/pricing-table"
import { siteConfig } from "@/config/site"
import type { Metadata } from "next"
import { PricingFaq } from "@/app/(main)/pricing/components/pricing-faq"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.pricing.title,
  description: siteConfig.seo.metaData.pricing.description,
}

export default async function PricingPage() {
  const session = await getServerSession()
  let userTier: TierKey | null = null

  if (session?.user) {
    const access = await getUserAccessLevel(session.user.id)
    userTier = access.tier
  }

  return (
    <div className="flex flex-col gap-20 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Simple pricing, no surprises
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start free, scale when you're ready. Cancel anytime.
        </p>
      </div>

      <PricingTable isLoggedIn={!!session?.user} userTier={userTier} />
      <PricingFaq />
    </div>
  )
}
