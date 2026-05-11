"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { TIERS, PRICING_CURRENCY } from "@/config/pricing"
import { CheckoutButton } from "@/app/(main)/pricing/components/checkout-button"
import { TIERS_KEYS } from "@/db/types/payments/tier"
import type { TierKey } from "@/db/types/payments/tier"
import { getSubscriptionStatus } from "@/lib/payments/client"

type BillingPeriod = "monthly" | "annual"

interface PricingTableProps {
  isLoggedIn: boolean
  userTier: TierKey | null
}

const TIER_ORDER: TierKey[] = Object.keys(TIERS) as TierKey[]

type TierAction = "current" | "upgrade" | "downgrade" | "free" | "signup"

export function PricingTable({ isLoggedIn, userTier }: PricingTableProps) {
  const [billing, setBilling] = useState<BillingPeriod>("annual")
  const [periodEnd, setPeriodEnd] = useState<Date | null>(null)
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false)

  useEffect(() => {
    if (!isLoggedIn || !userTier || userTier === TIERS_KEYS.STARTER) return
    getSubscriptionStatus()
      .then((data) => {
        if (data.currentPeriodEnd) {
          setPeriodEnd(new Date(data.currentPeriodEnd))
        }
        setCancelAtPeriodEnd(data.cancelAtPeriodEnd ?? false)
      })
      .catch(() => {
        // non-critical — silently ignore
      })
  }, [isLoggedIn, userTier])

  const tiers = Object.values(TIERS).filter((tier) => {
    if (!userTier) return true
    return TIER_ORDER.indexOf(tier.key) >= TIER_ORDER.indexOf(userTier)
  })

  function getTierAction(tierKey: TierKey): TierAction {
    if (!isLoggedIn || !userTier) {
      return tierKey === TIERS_KEYS.STARTER ? "free" : "signup"
    }
    if (tierKey === userTier) return "current"
    return TIER_ORDER.indexOf(tierKey) > TIER_ORDER.indexOf(userTier)
      ? "upgrade"
      : "downgrade"
  }

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Billing toggle */}
      <div className="flex flex-col items-center gap-2">
        <Tabs
          value={billing}
          onValueChange={(value) => setBilling(value as BillingPeriod)}
        >
          <TabsList aria-label="Select billing period">
            <TabsTrigger
              value="monthly"
              className="cursor-pointer data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm dark:data-[state=active]:bg-input/30 dark:data-[state=active]:border-input"
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger
              value="annual"
              className="cursor-pointer data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm dark:data-[state=active]:bg-input/30 dark:data-[state=active]:border-input"
            >
              Annual
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-sm text-muted-foreground">
          {billing === "annual" ? (
            <>
              <span className="text-xl font-bold text-primary">Save 20%</span> —
              billed as one annual payment
            </>
          ) : (
            "Billed month to month"
          )}
        </p>
      </div>

      {/* Plans */}
      <div className="w-full flex justify-center">
        <div
          className={`grid grid-cols-1 gap-5 w-full ${
            tiers.length === 1
              ? "md:grid-cols-1 max-w-sm"
              : tiers.length === 2
                ? "md:grid-cols-2 max-w-2xl"
                : "md:grid-cols-3"
          }`}
          role="list"
          aria-label="Pricing plans"
        >
          {tiers.map((tier) => {
            const price = tier.displayPrice[billing]
            const activePriceId = tier.priceId[billing]
            const isFree = activePriceId === null
            const action = getTierAction(tier.key)

            return (
              <div
                key={tier.key}
                role="listitem"
                aria-label={`${tier.name} plan`}
                className={`flex flex-col gap-6 p-6 rounded-xl border ${
                  tier.highlighted
                    ? "border-primary bg-primary/5 relative"
                    : "border-border bg-card"
                }`}
              >
                {tier.highlighted && action !== "current" && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                    aria-label="Most popular plan"
                  >
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h2 className="text-3xl font-bold text-foreground">
                    {tier.name}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {tier.description}
                  </p>
                </div>

                <div
                  className="flex items-baseline gap-2"
                  aria-label={`Price: ${price.amount}${price.period}`}
                >
                  {billing === "annual" && !isFree && (
                    <span
                      className="text-2xl font-semibold text-muted-foreground/60 line-through decoration-2"
                      aria-label={`Original monthly price: ${PRICING_CURRENCY}${tier.displayPrice.monthly.amount}`}
                    >
                      {PRICING_CURRENCY}
                      {tier.displayPrice.monthly.amount}
                    </span>
                  )}
                  <span className="flex items-baseline">
                    <span className="text-4xl font-bold text-foreground">
                      {price.amount === "Free"
                        ? price.amount
                        : `${PRICING_CURRENCY}${price.amount}`}
                    </span>
                    {price.period && (
                      <span className="text-muted-foreground text-sm">
                        {price.period}
                      </span>
                    )}
                  </span>
                </div>

                <ul
                  className="flex flex-col gap-2 flex-1"
                  aria-label={`${tier.name} plan features`}
                >
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Check
                        className="w-4 h-4 text-primary shrink-0"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {action === "current" && (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      disabled
                      aria-label={`${tier.name} is your current plan`}
                    >
                      Your current plan
                    </Button>
                    {periodEnd && (
                      <p className="text-xs text-center text-muted-foreground">
                        {cancelAtPeriodEnd ? "Expires" : "Renews"}{" "}
                        <time dateTime={periodEnd.toISOString()}>
                          {periodEnd.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </time>
                        {cancelAtPeriodEnd && (
                          <span className="block text-destructive mt-0.5">
                            Cancellation scheduled
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                )}

                {action === "free" && (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full"
                    aria-label={
                      isLoggedIn ? "Go to dashboard" : "Get started for free"
                    }
                  >
                    <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                      {isLoggedIn ? "Go to dashboard" : "Get started free"}
                    </Link>
                  </Button>
                )}

                {action === "signup" && (
                  <CheckoutButton
                    priceId={activePriceId!}
                    type="subscription"
                    variant="default"
                    size="lg"
                    className="w-full"
                    aria-label={`Subscribe to ${tier.name}, billed ${billing}`}
                  >
                    Get {tier.name}
                  </CheckoutButton>
                )}

                {action === "upgrade" && (
                  <CheckoutButton
                    priceId={activePriceId!}
                    type="subscription"
                    variant="default"
                    size="lg"
                    className="w-full"
                    aria-label={`Upgrade to ${tier.name}, billed ${billing}`}
                  >
                    Upgrade to {tier.name}
                  </CheckoutButton>
                )}

                {action === "downgrade" && (
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full text-muted-foreground"
                    aria-label={`Downgrade to ${tier.name}`}
                    disabled
                  >
                    Downgrade to {tier.name}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
