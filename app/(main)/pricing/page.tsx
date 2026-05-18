import { getServerSession } from "@/lib/auth/get-server-session"
import { getUserAccessLevel } from "@/lib/payments/subscription-state"
import type { TierKey } from "@/db/types/payments/tier"
import { PricingTable } from "@/app/(main)/pricing/components/pricing-table"
import { siteConfig } from "@/config/site"
import { PricingFaq } from "@/app/(main)/pricing/components/pricing-faq"
import { CheckoutListener } from "@/app/(main)/pricing/components/checkout-listener"
import { buildPageMetadata } from "@/lib/build-page-metadata"

export const metadata = buildPageMetadata({
  title: siteConfig.seo.metaData.pricing.title,
  description: siteConfig.seo.metaData.pricing.description,
  canonical: `${siteConfig.brand.url}/pricing`,
})

export default async function PricingPage() {
  const session = await getServerSession()
  let userTier: TierKey | null = null

  if (session?.user) {
    const access = await getUserAccessLevel(session.user.id)
    userTier = access.tier
  }

  return (
    <div className="flex flex-col gap-20 py-16">
      <CheckoutListener />
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Simple pricing, no surprises
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start free, scale when you’re ready. Cancel anytime.
        </p>
      </div>

      <PricingTable isLoggedIn={!!session?.user} userTier={userTier} />
      <PricingFaq />
    </div>
  )
}
