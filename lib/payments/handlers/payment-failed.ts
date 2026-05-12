import type { NormalizedEvent } from "@/db/types/payments/webhook-events"

type PaymentFailedEvent = Extract<NormalizedEvent, { type: "payment.failed" }>

export async function handle(event: PaymentFailedEvent): Promise<void> {
  const { customerId } = event

  // Dunning email to customer
}
