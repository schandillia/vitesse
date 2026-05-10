import { db } from "@/db/drizzle"
import { subscriptions } from "@/db/payments-schema"
import { user } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { SUBSCRIPTION_STATUSES } from "@/db/types/payments/subscription-status"
import { TIERS_KEYS } from "@/db/types/payments/tier"
import type { NormalizedEvent } from "@/db/types/payments/webhook-events"

type SubscriptionDeletedEvent = Extract<
  NormalizedEvent,
  { type: "subscription.deleted" }
>

export async function handle(event: SubscriptionDeletedEvent): Promise<void> {
  const userId = event.customerId
  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.providerCustomerId, userId))

  if (!existingUser) {
    throw new Error(
      `No user found for provider customer ID: "${event.customerId}"`
    )
  }

  await db
    .update(subscriptions)
    .set({
      status: SUBSCRIPTION_STATUSES.CANCELED,
      canceledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.providerSubscriptionId, event.subscriptionId))

  await db
    .update(user)
    .set({ tier: TIERS_KEYS.STARTER })
    .where(eq(user.id, existingUser.id))
}
