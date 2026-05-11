import type { TierKey } from "@/db/types/payments/tier"
import type { ProviderName } from "@/db/types/payments/payment-provider"

// ── Currency ──────────────────────────────────────────────────────────────────
// The currency symbol displayed on the pricing page.
// Change this to match your payment provider's billing currency.
// Examples: "$" for USD, "₹" for INR, "€" for EUR, "£" for GBP
export const PRICING_CURRENCY = "₹"

// ── Tier Types ────────────────────────────────────────────────────────────────
export interface TierDisplayPrice {
  amount: string // numeric only, e.g. "29" not "$29"
  period: string
  saving?: string
}

export interface TierConfig {
  key: TierKey
  name: string
  description: string
  priceId: {
    monthly: string | null
    annual: string | null
  }
  displayPrice: {
    monthly: TierDisplayPrice
    annual: TierDisplayPrice
  }
  limits: {
    seats: number
    projects: number
    storageGb: number
    apiCallsPerMonth: number
  }
  features: string[]
  highlighted: boolean
}

// ── Tiers ─────────────────────────────────────────────────────────────────────
// priceId values here are internal keys — they must match keys in PRICE_MAP below.
// null means free (no payment required).
export const TIERS: Record<TierKey, TierConfig> = {
  starter: {
    key: "starter",
    name: "Starter",
    description: "Everything you need to get started, free forever",
    priceId: {
      monthly: null,
      annual: null,
    },
    displayPrice: {
      monthly: { amount: "Free", period: "" },
      annual: { amount: "Free", period: "" },
    },
    limits: { seats: 1, projects: 3, storageGb: 1, apiCallsPerMonth: 1000 },
    features: [
      "Up to 3 projects",
      "1 GB storage",
      "1,000 API calls/month",
      "Community support",
    ],
    highlighted: false,
  },
  pro: {
    key: "pro",
    name: "Pro",
    description: "For individuals and small teams moving fast",
    priceId: {
      monthly: "pro_monthly",
      annual: "pro_yearly",
    },
    displayPrice: {
      monthly: { amount: "100", period: "/month" },
      annual: { amount: "80", period: "/month", saving: "Save 20%" },
    },
    limits: { seats: 5, projects: 20, storageGb: 20, apiCallsPerMonth: 50000 },
    features: [
      "Up to 20 projects",
      "20 GB storage",
      "50,000 API calls/month",
      "Priority email support",
      "Advanced analytics",
    ],
    highlighted: true,
  },
  business: {
    key: "business",
    name: "Business",
    description: "For growing teams that need scale and control",
    priceId: {
      monthly: "business_monthly",
      annual: "business_yearly",
    },
    displayPrice: {
      monthly: { amount: "200", period: "/month" },
      annual: { amount: "160", period: "/month", saving: "Save 20%" },
    },
    limits: { seats: 25, projects: -1, storageGb: 100, apiCallsPerMonth: -1 },
    features: [
      "Unlimited projects",
      "100 GB storage",
      "Unlimited API calls",
      "Up to 25 seats",
      "Dedicated support",
    ],
    highlighted: false,
  },
}

// ── Price Map ─────────────────────────────────────────────────────────────────
// Maps internal price IDs to each provider's actual dashboard IDs.
//
// Stripe:        price_xxx  (Products → your plan → Pricing)
// LemonSqueezy:  variant ID as a string  (Store → Products → Variants)
// Razorpay:      plan_xxx for subscriptions
// ─────────────────────────────────────────────────────────────────────────────
export const PRICE_MAP = {
  pro_monthly: {
    stripe: "price_REPLACE_ME",
    lemonsqueezy: "1634972",
    razorpay: "plan_SnzGrSZLZkRYde",
  },
  pro_yearly: {
    stripe: "price_REPLACE_ME",
    lemonsqueezy: "1634976",
    razorpay: "plan_SnzJPIf4toJtFa",
  },
  business_monthly: {
    stripe: "price_REPLACE_ME",
    lemonsqueezy: "1634970",
    razorpay: "plan_SnzKhCPGgFt4Ou",
  },
  business_yearly: {
    stripe: "price_REPLACE_ME",
    lemonsqueezy: "1634984",
    razorpay: "plan_SnzKCn5fWDQgyC",
  },
} satisfies Record<string, Record<ProviderName, string>>

// Derived type — no manual maintenance needed when adding/removing plans
export type InternalPriceId = keyof typeof PRICE_MAP
