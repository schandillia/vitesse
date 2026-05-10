import { db } from "@/db/drizzle"
import { subscriptions, orders } from "@/db/payments-schema"
import { TIERS } from "@/config/tiers"
import { TIERS_KEYS } from "@/db/types/payments/tier"
import { SUBSCRIPTION_STATUSES } from "@/db/types/payments/subscription-status"
import type { TierKey } from "@/db/types/payments/tier"
import type { TierConfig } from "@/config/tiers"
import { eq, desc, and } from "drizzle-orm"

export interface UserAccessLevel {
  tier: TierKey
  tierConfig: TierConfig
  subscriptionId: string | null
  status: string | null
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
  trialEnd: Date | null
  hasActiveAccess: boolean
}

const ACCESS_GRANTING_STATUSES = new Set<string>([
  SUBSCRIPTION_STATUSES.ACTIVE,
  SUBSCRIPTION_STATUSES.TRIALING,
  SUBSCRIPTION_STATUSES.PAST_DUE,
])

export async function getUserAccessLevel(
  userId: string
): Promise<UserAccessLevel> {
  // Lifetime order takes precedence over everything
  const [lifetimeOrder] = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.userId, userId),
        eq(orders.status, "paid"),
        eq(orders.planId, "lifetime")
      )
    )
    .limit(1)

  if (lifetimeOrder) {
    return {
      tier: TIERS_KEYS.BUSINESS,
      tierConfig: TIERS[TIERS_KEYS.BUSINESS],
      subscriptionId: null,
      status: "active",
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      trialEnd: null,
      hasActiveAccess: true,
    }
  }

  // Check most recent subscription
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1)

  if (!sub) {
    return buildFreeAccess()
  }

  const hasActiveAccess = ACCESS_GRANTING_STATUSES.has(sub.status)
  const tierKey = resolveTierKeyFromPlanId(sub.planId)

  return {
    tier: hasActiveAccess ? tierKey : TIERS_KEYS.STARTER,
    tierConfig: hasActiveAccess ? TIERS[tierKey] : TIERS[TIERS_KEYS.STARTER],
    subscriptionId: sub.providerSubscriptionId,
    status: sub.status,
    currentPeriodEnd: sub.currentPeriodEnd,
    cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
    trialEnd: sub.trialEnd,
    hasActiveAccess,
  }
}

export async function requireTier(
  userId: string,
  minimumTier: TierKey
): Promise<void> {
  const { tier, hasActiveAccess } = await getUserAccessLevel(userId)
  const order: TierKey[] = [
    TIERS_KEYS.STARTER,
    TIERS_KEYS.PRO,
    TIERS_KEYS.BUSINESS,
  ]
  if (!hasActiveAccess || order.indexOf(tier) < order.indexOf(minimumTier)) {
    throw new Error(`This feature requires the ${minimumTier} plan or higher.`)
  }
}

function buildFreeAccess(): UserAccessLevel {
  return {
    tier: TIERS_KEYS.STARTER,
    tierConfig: TIERS[TIERS_KEYS.STARTER],
    subscriptionId: null,
    status: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    trialEnd: null,
    hasActiveAccess: true,
  }
}

function resolveTierKeyFromPlanId(planId: string): TierKey {
  if (planId.startsWith("pro")) return TIERS_KEYS.PRO
  if (planId.startsWith("business")) return TIERS_KEYS.BUSINESS
  return TIERS_KEYS.STARTER
}
