"use client"

import { useRouter } from "next/navigation"
import { KeyRoundIcon, Trash2 } from "lucide-react"
import { authClient } from "@/lib/auth/auth-client"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { DestructiveActionButton } from "@/components/auth/destructive-action-button"
import { formatDate } from "@/lib/date"
import type { ApiKeyItem } from "@/actions/fetch-api-keys"

interface KeyRowProps {
  apiKey: ApiKeyItem
}

export function KeyRow({ apiKey }: KeyRowProps) {
  const router = useRouter()

  const meta = apiKey.metadata ? JSON.parse(apiKey.metadata) : null
  const preview = meta?.preview ?? apiKey.prefix ?? "oolway_"

  const scopes = apiKey.permissions
    ? Object.keys(JSON.parse(apiKey.permissions))
    : []

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <KeyRoundIcon className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              {apiKey.name ?? "Unnamed Key"}
            </CardTitle>
            <CardDescription className="text-xs space-y-0.5">
              <span className="block">
                <code>{preview + "█".repeat(22)}</code>
              </span>
              <span className="block">
                Created {formatDate(apiKey.createdAt)}
                {apiKey.expiresAt && (
                  <> · Expires {formatDate(apiKey.expiresAt)}</>
                )}
              </span>
              {scopes.length > 0 && (
                <span className="flex flex-wrap gap-1 pt-0.5">
                  {scopes.map((scope) => (
                    <span
                      key={scope}
                      className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {scope}
                    </span>
                  ))}
                </span>
              )}
            </CardDescription>
          </div>
        </div>
        <DestructiveActionButton
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          requireAreYouSure
          successMessage="API key revoked"
          action={async () => {
            const res = await authClient.apiKey.delete({ keyId: apiKey.id })
            if (res?.error) return { error: res.error }
            router.refresh()
            return { error: null }
          }}
        >
          <Trash2 className="h-4 w-4" />
        </DestructiveActionButton>
      </CardHeader>
    </Card>
  )
}
