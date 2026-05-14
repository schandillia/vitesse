"use client"

import { Card, CardContent } from "@/components/ui/card"

import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"
import Link from "next/link"
import { GoDotFill } from "react-icons/go"

interface CurrentPlanCardProps {
  planName: string
  status: string
  renewsAt?: Date | null
  cancelAtPeriodEnd?: boolean
}

export function CurrentPlanCard({
  planName,
  status,
  renewsAt,
  cancelAtPeriodEnd,
}: CurrentPlanCardProps) {
  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Current Plan" />

      <Card className="max-w-2xl">
        <CardContent className="px-6 py-2">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">{planName}</p>

              <p className="text-sm text-muted-foreground">
                {cancelAtPeriodEnd
                  ? "Your subscription will end at the current billing period"
                  : renewsAt
                    ? `Renews ${renewsAt.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}`
                    : "No renewal date available"}
              </p>
            </div>

            <div className="flex flex-col space-y-4 items-end shrink-0">
              <div className="flex items-center text-muted-foreground capitalize rounded-full border pl-1 pr-2">
                <GoDotFill className="mr-1 text-green-500" />
                {status.replaceAll("_", " ")}
              </div>

              <Link
                href="/pricing"
                className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                Compare plans
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
