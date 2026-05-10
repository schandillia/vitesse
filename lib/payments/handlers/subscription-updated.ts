import { db } from "@/db/drizzle"
import { subscriptions } from "@/db/payments-schema"
import { user } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { SUBSCRIPTION_STATUSES } from "@/db/types/payments/subscription-status"
import { TIERS_KEYS } from "@/db/types/payments/tier"
import { resolveTierFromInternalPriceId } from "@/lib/payments/price-map"
import type { InternalPriceId } from "@/lib/payments/price-map"
import type { NormalizedEvent } from "@/db/types/payments/webhook-events"

type SubscriptionUpdatedEvent = Extract<
  NormalizedEvent,
  { type: "subscription.updated" }
>

const ACCESS_GRANTING_STATUSES = new Set<string>([
  SUBSCRIPTION_STATUSES.ACTIVE,
  SUBSCRIPTION_STATUSES.TRIALING,
  SUBSCRIPTION_STATUSES.PAST_DUE,
])

export async function handle(event: SubscriptionUpdatedEvent): Promise<void> {
  const { subscription, customerId } = event

  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.providerCustomerId, customerId))

  if (!existingUser) {
    throw new Error(`No user found for provider customer ID: "${customerId}"`)
  }

  await db
    .update(subscriptions)
    .set({
      planId: subscription.planId,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      trialEnd: subscription.trialEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      rawData: subscription as unknown as Record<string, unknown>,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.providerSubscriptionId, subscription.providerId))

  // Sync user tier based on new subscription status
  const hasAccess = ACCESS_GRANTING_STATUSES.has(subscription.status)
  const tierConfig = resolveTierFromInternalPriceId(
    subscription.planId as InternalPriceId
  )

  await db
    .update(user)
    .set({ tier: hasAccess ? tierConfig.key : TIERS_KEYS.STARTER })
    .where(eq(user.id, existingUser.id))
}
