import { TIERS } from "@/config/tiers"
import type { ProviderName } from "@/db/types/payments/payment-provider"

// Derived directly from config/tiers.ts — never hardcode these strings here.
// internal price IDs are whatever is set in each tier's priceId.monthly / .annual.
// Add or remove entries here only if you add or remove tiers in config/tiers.ts.
export type InternalPriceId =
  | "pro_monthly"
  | "pro_yearly"
  | "business_monthly"
  | "business_yearly"

type ProviderPriceMap = Record<ProviderName, string>
type PriceMap = Record<InternalPriceId, ProviderPriceMap>

// ── Provider Price IDs ────────────────────────────────────────────────────────
// Replace every REPLACE_ME value with the actual ID from your provider dashboard.
//
// Stripe:        price_xxx  (from Products → your plan → Pricing)
// LemonSqueezy:  variant ID as a string  (from Store → Products → Variants)
// Razorpay:      plan_xxx for subscriptions; amount in paise for one-time orders
// ─────────────────────────────────────────────────────────────────────────────
export const PRICE_MAP: PriceMap = {
  pro_monthly: {
    stripe: "price_REPLACE_ME",
    lemonsqueezy: "1634972",
    razorpay: "plan_REPLACE_ME",
  },
  pro_yearly: {
    stripe: "price_REPLACE_ME",
    lemonsqueezy: "1634976",
    razorpay: "plan_REPLACE_ME",
  },
  business_monthly: {
    stripe: "price_REPLACE_ME",
    lemonsqueezy: "1634970",
    razorpay: "plan_REPLACE_ME",
  },
  business_yearly: {
    stripe: "price_REPLACE_ME",
    lemonsqueezy: "1634984",
    razorpay: "plan_REPLACE_ME",
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Forward lookup: internal ID → provider-specific ID
export function resolveProviderPriceId(
  internalId: InternalPriceId,
  provider: ProviderName
): string {
  const entry = PRICE_MAP[internalId]
  if (!entry) throw new Error(`Unknown internal price ID: "${internalId}"`)
  const providerPriceId = entry[provider]
  if (!providerPriceId)
    throw new Error(
      `No ${provider} price configured for internal ID: "${internalId}"`
    )
  return providerPriceId
}

// Reverse lookup: provider-specific ID → internal ID
export function resolveInternalPriceId(
  providerPriceId: string,
  provider: ProviderName
): InternalPriceId | null {
  for (const [internal, map] of Object.entries(PRICE_MAP)) {
    if (map[provider] === providerPriceId) return internal as InternalPriceId
  }
  return null
}

// Convenience: given an internal ID, return the matching TierConfig from config/tiers.ts
// Useful in webhook handlers when you need tier limits after resolving a plan.
export function resolveTierFromInternalPriceId(internalId: InternalPriceId) {
  const entry = Object.values(TIERS).find(
    (tier) =>
      tier.priceId.monthly === internalId || tier.priceId.annual === internalId
  )
  return entry ?? TIERS.starter
}
