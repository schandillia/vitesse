"use client"

import { useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"
import { Button } from "@/components/ui/button"
import { disconnectAccount } from "@/actions/disconnect-account"
import { PROVIDER_LABELS } from "@/db/types/providers"
import { toast } from "react-hot-toast"
import type { ConnectedAccount } from "@/actions/get-connected-accounts"

interface ConnectedAccountsCardProps {
  accounts: ConnectedAccount[]
  emailVerified: boolean
}

export function ConnectedAccountsCard({
  accounts,
  emailVerified,
}: ConnectedAccountsCardProps) {
  const [isPending, startTransition] = useTransition()
  const canDisconnect = accounts.length > 1 || emailVerified

  const handleDisconnect = (accountId: string) => {
    startTransition(async () => {
      const result = await disconnectAccount(accountId)
      if (!result.success) {
        toast.error(result.error)
      } else {
        toast.success("Account disconnected.")
      }
    })
  }

  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Sign-in Methods" />
      <Card className="max-w-2xl">
        <CardContent className="px-6 py-2">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="flex items-center justify-between gap-4 py-3 border-b last:border-0"
            >
              <span className="text-xs text-muted-foreground uppercase tracking-wide w-28 shrink-0">
                {PROVIDER_LABELS[acc.providerId] ?? acc.providerId}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">
                  Connected{" "}
                  {acc.createdAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={isPending || !canDisconnect}
                onClick={() => handleDisconnect(acc.id)}
                className="shrink-0"
              >
                Disconnect
              </Button>
            </div>
          ))}
          {emailVerified && (
            <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
              <span className="text-xs text-muted-foreground uppercase tracking-wide w-28 shrink-0">
                Magic Link
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">
                  Available via your email address
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                Always on
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
