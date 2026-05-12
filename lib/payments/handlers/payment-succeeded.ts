import type { NormalizedEvent } from "@/db/types/payments/webhook-events"

type PaymentSucceededEvent = Extract<
  NormalizedEvent,
  { type: "payment.succeeded" }
>

export async function handle(event: PaymentSucceededEvent): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { customerId, amountPaid, currency, subscriptionId } = event

  // Dunning email to customer
}
