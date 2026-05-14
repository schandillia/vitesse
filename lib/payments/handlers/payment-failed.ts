import { eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { user } from "@/db/auth-schema"
import { sendEmail } from "@/lib/send-email"
import { renderPaymentFailedEmail } from "@/emails/payment-failed"
import { siteConfig } from "@/config/site"
import type { NormalizedEvent } from "@/db/types/payments/webhook-events"

type PaymentFailedEvent = Extract<NormalizedEvent, { type: "payment.failed" }>

export async function handle(event: PaymentFailedEvent): Promise<void> {
  const { customerId } = event

  if (!customerId) {
    return
  }

  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.providerCustomerId, customerId))

  if (!existingUser) {
    return
  }

  await sendEmail({
    to: existingUser.email,
    from: `${siteConfig.emails.subscriptions.sender} <${siteConfig.emails.subscriptions.fromEmail}>`,
    subject: "We couldn’t process your payment",
    body: await renderPaymentFailedEmail({
      name: existingUser.name,
    }),
  })

  // mark account past_due
  // start grace-period timer
  // enqueue retry notification
  // notify analytics
}
