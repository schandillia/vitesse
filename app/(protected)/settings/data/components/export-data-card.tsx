"use client"

import { useState, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"
import { Button } from "@/components/ui/button"
import { exportUserData } from "@/actions/export-user-data"
import { DownloadIcon } from "lucide-react"
import { toast } from "react-hot-toast"
import { LoadingSwap } from "@/components/ui/loading-swap"

interface ExportDataCardProps {
  username: string
}

export function ExportDataCard({ username }: ExportDataCardProps) {
  const [isPending, startTransition] = useTransition()

  const handleExport = () => {
    startTransition(async () => {
      const result = await exportUserData()
      if (!result.success) {
        toast.error(result.error)
        return
      }

      const blob = new Blob([result.data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${username}_data_${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Your data has been downloaded.")
    })
  }

  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Export Your Data" />
      <Card className="max-w-2xl">
        <CardContent className="px-6 py-4 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Download a copy of all your personal data, preferences, connected
            accounts, and content in JSON format.
          </p>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isPending}
            className="shrink-0 gap-2"
          >
            <LoadingSwap isLoading={isPending}>
              <span className="flex items-center gap-2">
                <DownloadIcon className="size-4" />
                Download
              </span>
            </LoadingSwap>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
