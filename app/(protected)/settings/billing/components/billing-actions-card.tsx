"use client"

import { useTransition } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"

interface BillingActionsCardProps {
  canManageBilling: boolean
  canCancel: boolean
  canResume: boolean
  cancelAtPeriodEnd?: boolean
  onManageBilling: () => Promise<void>
  onCancel: () => Promise<void>
  onResume: () => Promise<void>
}

export function BillingActionsCard({
  canManageBilling,
  canCancel,
  canResume,
  cancelAtPeriodEnd,
  onManageBilling,
  onCancel,
  onResume,
}: BillingActionsCardProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Subscription Actions" />

      <Card className="max-w-2xl">
        <CardContent className="px-6 py-2">
          {canManageBilling && (
            <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Billing portal</p>

                <p className="text-sm text-muted-foreground">
                  Manage invoices, payment methods, and billing details
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await onManageBilling()
                  })
                }
                className="shrink-0"
              >
                Manage billing
              </Button>
            </div>
          )}

          {canCancel && !cancelAtPeriodEnd && (
            <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Cancel subscription</p>

                <p className="text-sm text-muted-foreground">
                  Your subscription will remain active until the end of the
                  current billing period
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await onCancel()
                  })
                }
                className="shrink-0"
              >
                Cancel
              </Button>
            </div>
          )}

          {canResume && cancelAtPeriodEnd && (
            <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Resume subscription</p>

                <p className="text-sm text-muted-foreground">
                  Continue your subscription without interruption
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await onResume()
                  })
                }
                className="shrink-0"
              >
                Resume
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
