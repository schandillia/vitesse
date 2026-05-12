import { db } from "@/db/drizzle"
import { subscriptions } from "@/db/payments-schema"
import { user } from "@/db/auth-schema"
import { providerPromise } from "@/lib/payments"
import { eq, or } from "drizzle-orm"
import { resolveTierFromInternalPriceId } from "@/lib/payments/tier-utils"
import type { InternalPriceId } from "@/config/pricing"
import type { NormalizedEvent } from "@/db/types/payments/webhook-events"

type SubscriptionCreatedEvent = Extract<
  NormalizedEvent,
  { type: "subscription.created" }
>

export async function handle(event: SubscriptionCreatedEvent): Promise<void> {
  const { subscription, customerId } = event

  const userId = subscription.metadata?.user_id
  const customerEmail = subscription.customerEmail

  const [existingUser] = await db
    .select()
    .from(user)
    .where(
      or(
        userId ? eq(user.id, userId) : undefined,
        customerId ? eq(user.providerCustomerId, customerId) : undefined,
        customerEmail ? eq(user.email, customerEmail) : undefined
      )
    )

  if (!existingUser) {
    throw new Error(`No user found for provider customer ID: "${customerId}"`)
  }

  const realCustomerId = customerId ? String(customerId) : null
  const tierConfig = resolveTierFromInternalPriceId(
    subscription.planId as InternalPriceId
  )
  const provider = await providerPromise

  await db
    .insert(subscriptions)
    .values({
      userId: existingUser.id,
      provider: provider.name,
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

  await db
    .update(user)
    .set({
      tier: tierConfig.key,
      ...(realCustomerId && existingUser.providerCustomerId !== realCustomerId
        ? { providerCustomerId: realCustomerId }
        : {}),
    })
    .where(eq(user.id, existingUser.id))
}
