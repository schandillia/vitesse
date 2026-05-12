export type CheckoutParams =
  | {
      type: "one_time"
      customerId?: string
      priceId: string
      quantity?: number
      metadata?: Record<string, string>
      successUrl: string
      cancelUrl: string
    }
  | {
      type: "subscription"
      customerId?: string
      priceId: string
      trialDays?: number
      metadata?: Record<string, string>
      successUrl: string
      cancelUrl: string
    }

export type CheckoutResult =
  | {
      mode: "redirect"
      url: string
    }
  | {
      mode: "modal"
      orderId: string
      customerId?: string
      keyId: string
      amount: number
      currency: string
      prefill?: {
        name?: string
        email?: string
        contact?: string
      }
    }

export interface VerifyCheckoutParams {
  razorpayPaymentId: string
  razorpayOrderId: string
  razorpaySignature: string
}

export interface VerifyCheckoutResult {
  success: boolean
  paymentId: string
}
