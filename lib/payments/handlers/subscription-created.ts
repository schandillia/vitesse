import { db } from "@/db/drizzle"
import { subscriptions } from "@/db/payments-schema"
import { user } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { resolveTierFromInternalPriceId } from "@/lib/payments/price-map"
import type { InternalPriceId } from "@/lib/payments/price-map"
import type { NormalizedEvent } from "@/db/types/payments/webhook-events"

type SubscriptionCreatedEvent = Extract<
  NormalizedEvent,
  { type: "subscription.created" }
>

export async function handle(event: SubscriptionCreatedEvent): Promise<void> {
  const { subscription, customerId } = event

  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.providerCustomerId, customerId))

  if (!existingUser) {
    throw new Error(`No user found for provider customer ID: "${customerId}"`)
  }

  const tierConfig = resolveTierFromInternalPriceId(
    subscription.planId as InternalPriceId
  )

  await db
    .insert(subscriptions)
    .values({
      userId: existingUser.id,
      provider: existingUser.paymentProvider ?? "stripe",
      providerSubscriptionId: subscription.providerId,
      planId: subscription.planId,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      trialEnd: subscription.trialEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      rawData: subscription as unknown as Record<string, unknown>,
    })
    .onConflictDoNothing()

  // Update user tier to reflect new subscription
  await db
    .update(user)
    .set({ tier: tierConfig.key })
    .where(eq(user.id, existingUser.id))
}
