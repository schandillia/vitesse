import Razorpay from "razorpay"
import { createHmac, timingSafeEqual } from "crypto"
import { env } from "@/env"
import type {
  PaymentProvider,
  ProviderCapabilities,
} from "@/db/types/payments/provider"
import type {
  CreateCustomerParams,
  Customer,
} from "@/db/types/payments/customer"
import type {
  CheckoutParams,
  CheckoutResult,
  VerifyCheckoutParams,
  VerifyCheckoutResult,
} from "@/db/types/payments/checkout"
import type { NormalizedSubscription } from "@/db/types/payments/normalized-subscription"
import type {
  RawProviderEvent,
  NormalizedEvent,
} from "@/db/types/payments/webhook-events"
import {
  WebhookSignatureError,
  CheckoutVerificationError,
  ProviderCapabilityError,
} from "@/db/types/payments/payment-errors"
import {
  resolveProviderPriceId,
  resolveInternalPriceId,
} from "@/lib/payments/tier-utils"
import { SUBSCRIPTION_STATUSES } from "@/db/types/payments/subscription-status"
import type { NormalizedSubscriptionStatus } from "@/db/types/payments/subscription-status"

if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
  throw new Error(
    "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set when PAYMENT_PROVIDER=razorpay."
  )
}

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
})

// ── Type helpers ──────────────────────────────────────────────────────────────
// Razorpay SDK types are loose — these narrow what we need

interface RazorpayCustomer {
  id: string
  name: string
  email: string
  contact: string
}

interface RazorpaySubscription {
  id: string
  plan_id: string
  customer_id: string
  status: string
  current_start: number | null
  current_end: number | null
  ended_at: number | null
  charge_at: number | null
  cancel_at_cycle_end: number
  trial_start: number | null
  trial_end: number | null
}

interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  receipt?: string
}

export class RazorpayAdapter implements PaymentProvider {
  readonly name = "razorpay" as const

  readonly capabilities: ProviderCapabilities = {
    hostedCheckout: false,
    billingPortal: false,
    freeTrials: false,
    proration: false,
    automaticTax: false,
    subscriptionPause: true,
    idempotencyKeys: true,
    localPaymentMethods: ["upi", "netbanking", "cards"],
  }

  // ── Customer ───────────────────────────────────────────────────────────────

  async createCustomer(params: CreateCustomerParams): Promise<Customer> {
    const customer = (await razorpay.customers.create({
      name: params.name ?? "",
      email: params.email,
      fail_existing: 0, // return existing customer if email already exists
    })) as unknown as RazorpayCustomer

    return {
      id: customer.id,
      email: customer.email,
      name: customer.name,
    }
  }

  async getCustomer(customerId: string): Promise<Customer> {
    const customer = (await razorpay.customers.fetch(
      customerId
    )) as unknown as RazorpayCustomer

    return {
      id: customer.id,
      email: customer.email,
      name: customer.name,
    }
  }

  // ── Checkout ───────────────────────────────────────────────────────────────

  async initiateCheckout(params: CheckoutParams): Promise<CheckoutResult> {
    if (params.type === "subscription") {
      const providerPlanId = resolveProviderPriceId(
        params.priceId as Parameters<typeof resolveProviderPriceId>[0],
        "razorpay"
      )

      const subscription = (await razorpay.subscriptions.create({
        plan_id: providerPlanId,
        customer_notify: 1,
        quantity: 1,
        total_count: 120, // max billing cycles — effectively unlimited
        addons: [],
        notes: params.metadata ?? {},
      })) as unknown as RazorpaySubscription

      return {
        mode: "modal",
        orderId: subscription.id,
        keyId: env.RAZORPAY_KEY_ID!,
        amount: 0, // amount is determined by the plan — not needed for subscriptions
        currency: "INR",
        prefill: {
          name: params.metadata?.userName,
          email: params.metadata?.userEmail,
        },
      }
    }

    // One-time payment
    const providerPriceId = resolveProviderPriceId(
      params.priceId as Parameters<typeof resolveProviderPriceId>[0],
      "razorpay"
    )

    // For one-time payments, razorpay entry in PRICE_MAP is the amount in paise
    const amount = parseInt(providerPriceId, 10)

    const order = (await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: params.metadata ?? {},
    })) as unknown as RazorpayOrder

    return {
      mode: "modal",
      orderId: order.id,
      keyId: env.RAZORPAY_KEY_ID!,
      amount: order.amount,
      currency: order.currency,
      prefill: {
        name: params.metadata?.userName,
        email: params.metadata?.userEmail,
      },
    }
  }

  async verifyCheckout(
    params: VerifyCheckoutParams
  ): Promise<VerifyCheckoutResult> {
    if (!env.RAZORPAY_KEY_SECRET) {
      throw new CheckoutVerificationError("RAZORPAY_KEY_SECRET is not set.")
    }

    const expectedSignature = createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
      .digest("hex")

    const expected = Buffer.from(expectedSignature, "hex")
    const received = Buffer.from(params.razorpaySignature, "hex")

    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    ) {
      throw new CheckoutVerificationError(
        "Razorpay checkout signature verification failed."
      )
    }

    return {
      success: true,
      paymentId: params.razorpayPaymentId,
    }
  }

  // ── Subscription management ────────────────────────────────────────────────

  async getSubscription(
    subscriptionId: string
  ): Promise<NormalizedSubscription> {
    const sub = (await razorpay.subscriptions.fetch(
      subscriptionId
    )) as unknown as RazorpaySubscription

    return this.normalizeSubscription(sub)
  }

  async cancelSubscription(
    subscriptionId: string,
    opts?: { immediately?: boolean }
  ): Promise<NormalizedSubscription> {
    const cancelAtCycleEnd = opts?.immediately ? 0 : 1

    const sub = (await razorpay.subscriptions.cancel(
      subscriptionId,
      cancelAtCycleEnd === 1
    )) as unknown as RazorpaySubscription

    return this.normalizeSubscription(sub)
  }

  async resumeSubscription(
    subscriptionId: string
  ): Promise<NormalizedSubscription> {
    // Razorpay resume — only works if subscription is in "paused" state
    const sub = (await (
      razorpay.subscriptions as unknown as {
        resume: (
          id: string,
          params: Record<string, unknown>
        ) => Promise<unknown>
      }
    ).resume(subscriptionId, { resume_at: "now" })) as RazorpaySubscription

    return this.normalizeSubscription(sub)
  }

  async changeSubscriptionPlan(
    subscriptionId: string
  ): Promise<NormalizedSubscription> {
    // Razorpay does not support proration — cancel and resubscribe
    // Cancel at period end, then the frontend should initiate a new checkout
    const sub = (await razorpay.subscriptions.cancel(
      subscriptionId,
      true // cancel at cycle end
    )) as unknown as RazorpaySubscription

    return this.normalizeSubscription(sub)
  }

  // ── Billing portal ─────────────────────────────────────────────────────────

  async createBillingPortalSession(): Promise<{ url: string }> {
    throw new ProviderCapabilityError("razorpay", "billingPortal")
  }

  // ── Webhooks ───────────────────────────────────────────────────────────────

  async constructWebhookEvent(
    rawBody: Buffer,
    signature: string
  ): Promise<RawProviderEvent> {
    if (!env.RAZORPAY_WEBHOOK_SECRET) {
      throw new Error("RAZORPAY_WEBHOOK_SECRET is not set.")
    }

    const expectedSignature = createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex")

    const expected = Buffer.from(expectedSignature, "hex")
    const received = Buffer.from(signature, "hex")

    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    ) {
      throw new WebhookSignatureError("razorpay")
    }

    return JSON.parse(rawBody.toString()) as RawProviderEvent
  }

  normalizeWebhookEvent(raw: RawProviderEvent): NormalizedEvent | null {
    const event = raw as {
      event: string
      payload: Record<string, unknown>
    }

    switch (event.event) {
      case "payment.captured": {
        const payment = (
          event.payload.payment as { entity: Record<string, unknown> }
        ).entity
        return {
          type: "payment.succeeded",
          customerId: payment.customer_id as string,
          amountPaid: payment.amount as number,
          currency: payment.currency as string,
        }
      }

      case "payment.failed": {
        const payment = (
          event.payload.payment as { entity: Record<string, unknown> }
        ).entity
        return {
          type: "payment.failed",
          customerId: payment.customer_id as string,
        }
      }

      case "subscription.activated": {
        const sub = (
          event.payload.subscription as { entity: RazorpaySubscription }
        ).entity
        return {
          type: "subscription.created",
          customerId: sub.customer_id,
          subscription: this.normalizeSubscription(sub),
        }
      }

      case "subscription.updated": {
        const sub = (
          event.payload.subscription as { entity: RazorpaySubscription }
        ).entity
        return {
          type: "subscription.updated",
          customerId: sub.customer_id,
          subscription: this.normalizeSubscription(sub),
        }
      }

      case "subscription.cancelled":
      case "subscription.completed": {
        const sub = (
          event.payload.subscription as { entity: RazorpaySubscription }
        ).entity
        return {
          type: "subscription.deleted",
          customerId: sub.customer_id,
          subscriptionId: sub.id,
        }
      }

      case "subscription.charged": {
        const sub = (
          event.payload.subscription as { entity: RazorpaySubscription }
        ).entity
        const payment = event.payload.payment
          ? (event.payload.payment as { entity: Record<string, unknown> })
              .entity
          : null
        return {
          type: "payment.succeeded",
          customerId: sub.customer_id,
          subscriptionId: sub.id,
          amountPaid: (payment?.amount as number) ?? 0,
          currency: (payment?.currency as string) ?? "INR",
        }
      }

      case "refund.created": {
        const refund = (
          event.payload.refund as { entity: Record<string, unknown> }
        ).entity
        return {
          type: "refund.created",
          customerId: refund.customer_id as string,
          paymentId: refund.payment_id as string,
          refundId: refund.id as string,
          amount: refund.amount as number,
          currency: refund.currency as string,
        }
      }

      default:
        return { type: "unknown", rawType: event.event }
    }
  }

  // ── Refunds ────────────────────────────────────────────────────────────────

  async refundPayment(
    paymentId: string,
    amount?: number
  ): Promise<{ refundId: string; status: string }> {
    const refund = (await razorpay.payments.refund(paymentId, {
      ...(amount !== undefined ? { amount } : {}),
    })) as unknown as { id: string; status: string }

    return { refundId: refund.id, status: refund.status }
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private normalizeSubscription(
    sub: RazorpaySubscription
  ): NormalizedSubscription {
    const internalPlanId =
      resolveInternalPriceId(sub.plan_id, "razorpay") ?? "pro_monthly"

    const statusMap: Record<string, NormalizedSubscriptionStatus> = {
      created: SUBSCRIPTION_STATUSES.INCOMPLETE,
      authenticated: SUBSCRIPTION_STATUSES.INCOMPLETE,
      active: SUBSCRIPTION_STATUSES.ACTIVE,
      pending: SUBSCRIPTION_STATUSES.PAST_DUE,
      halted: SUBSCRIPTION_STATUSES.UNPAID,
      cancelled: SUBSCRIPTION_STATUSES.CANCELED,
      completed: SUBSCRIPTION_STATUSES.CANCELED,
      expired: SUBSCRIPTION_STATUSES.CANCELED,
      paused: SUBSCRIPTION_STATUSES.PAUSED,
    }

    const status = statusMap[sub.status] ?? SUBSCRIPTION_STATUSES.INCOMPLETE

    return {
      id: sub.id,
      providerId: sub.id,
      customerId: sub.customer_id,
      planId: internalPlanId,
      status,
      currentPeriodStart: sub.current_start
        ? new Date(sub.current_start * 1000)
        : new Date(),
      currentPeriodEnd: sub.current_end
        ? new Date(sub.current_end * 1000)
        : new Date(),
      cancelAtPeriodEnd: sub.cancel_at_cycle_end === 1,
      trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
      metadata: {},
    }
  }
}
