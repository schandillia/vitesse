"use client"

import { KeyRoundIcon } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"
import type { ApiKeyItem } from "@/actions/fetch-api-keys"
import { CreateKeyDialog } from "@/app/(protected)/developer/api-keys/components/create-key-dialog"
import { KeyRow } from "@/app/(protected)/developer/api-keys/components/key-row"

interface ApiKeysCardProps {
  apiKeys: ApiKeyItem[]
}

export function ApiKeysCard({ apiKeys }: ApiKeysCardProps) {
  return (
    <div className="space-y-2 max-w-2xl">
      <div className="flex items-center justify-between">
        <GatedPageSubheading text="API Keys" />
        <CreateKeyDialog />
      </div>

      {apiKeys.length === 0 ? (
        <Card>
          <CardHeader className="flex flex-col items-center text-center py-10">
            <KeyRoundIcon className="h-10 w-10 text-muted-foreground mb-4" />
            <CardTitle>No API keys yet</CardTitle>
            <CardDescription>
              Create an API key to authenticate requests to your application.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {apiKeys.map((key) => (
            <KeyRow key={key.id} apiKey={key} />
          ))}
        </div>
      )}
    </div>
  )
}
