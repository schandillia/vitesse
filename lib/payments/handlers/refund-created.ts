import { db } from "@/db/drizzle"
import { orders } from "@/db/payments-schema"
import { eq } from "drizzle-orm"
import type { NormalizedEvent } from "@/db/types/payments/webhook-events"

type RefundCreatedEvent = Extract<NormalizedEvent, { type: "refund.created" }>

export async function handle(event: RefundCreatedEvent): Promise<void> {
  // Mark the order as refunded if one exists for this payment
  await db
    .update(orders)
    .set({ status: "refunded" })
    .where(eq(orders.providerPaymentId, event.paymentId))
}
