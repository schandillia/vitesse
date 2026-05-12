"use client"

import { useState } from "react"
import { initiateCheckout, verifyCheckout } from "@/lib/payments/client"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import type { ComponentProps } from "react"
import { useRouter } from "next/navigation"

type ButtonVariant = ComponentProps<typeof Button>["variant"]
type ButtonSize = ComponentProps<typeof Button>["size"]

interface CheckoutButtonProps {
  priceId: string
  type: "one_time" | "subscription"
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  "aria-label"?: string
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void }
  }
}

async function loadRazorpayScript(): Promise<void> {
  if (typeof window.Razorpay !== "undefined") return
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Razorpay script failed to load"))
    document.body.appendChild(script)
  })
}

export function CheckoutButton({
  priceId,
  type,
  children,
  variant = "default",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
    setLoading(true)
    try {
      const result = await initiateCheckout({ priceId, type })

      if (result.mode === "redirect") {
        window.location.href = result.url
        return // keep loading=true — navigation is in progress
      }

      if (result.mode === "modal") {
        await loadRazorpayScript()

        await new Promise<void>((resolve, reject) => {
          const rzp = new window.Razorpay({
            key: result.keyId,
            ...(type === "one_time" ? { customer_id: result.customerId } : {}),
            subscription_id:
              type === "subscription" ? result.orderId : undefined,
            order_id: type === "one_time" ? result.orderId : undefined,
            amount: result.amount,
            currency: result.currency,
            prefill: result.prefill ?? {},
            handler: async (response: {
              razorpay_payment_id: string
              razorpay_order_id?: string
              razorpay_subscription_id?: string
              razorpay_signature: string
            }) => {
              try {
                await verifyCheckout({
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId:
                    response.razorpay_order_id ??
                    response.razorpay_subscription_id ??
                    "",
                  razorpaySignature: response.razorpay_signature,
                })
                // Poll until tier changes in DB (webhook may take a few seconds)
                const pollForTierChange = async () => {
                  for (let i = 0; i < 10; i++) {
                    await new Promise((r) => setTimeout(r, 2000))
                    const status = await fetch("/api/payments/subscription")
                    if (status.ok) {
                      const data = await status.json()
                      if (data.tier && data.tier !== "starter") {
                        break
                      }
                    }
                  }
                }

                await pollForTierChange()
                router.refresh()
                setLoading(false)
                resolve()
              } catch (err) {
                reject(err)
              }
            },
            modal: {
              ondismiss: () => {
                setLoading(false)
                resolve()
              },
            },
          })
          rzp.open()
        })
      }
    } catch (err) {
      console.error("Checkout failed:", err)
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      <LoadingSwap isLoading={loading}>
        <span className="flex items-center justify-center gap-x-2">
          {children}
        </span>
      </LoadingSwap>
    </Button>
  )
}
