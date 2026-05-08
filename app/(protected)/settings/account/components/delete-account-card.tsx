"use client"

import { useState, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deleteOwnAccount } from "@/actions/delete-own-account"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { LoadingSwap } from "@/components/ui/loading-swap"

export function DeleteAccountCard() {
  const [step, setStep] = useState<"idle" | "confirm">("idle")
  const [confirmationText, setConfirmationText] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteOwnAccount(confirmationText)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      router.push("/")
    })
  }

  return (
    <div className="space-y-2">
      <GatedPageSubheading text="Delete Account" />
      <Card className="max-w-2xl border-destructive/40">
        <CardContent className="px-6 py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>

          {step === "idle" && (
            <Button variant="destructive" onClick={() => setStep("confirm")}>
              Delete My Account
            </Button>
          )}

          {step === "confirm" && (
            <div className="space-y-3">
              <p className="text-sm">
                Type{" "}
                <span className="font-mono font-bold">delete my account</span>{" "}
                to confirm.
              </p>
              <Input
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="delete my account"
                disabled={isPending}
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={
                    isPending || confirmationText !== "delete my account"
                  }
                >
                  <LoadingSwap isLoading={isPending}>
                    Permanently Delete
                  </LoadingSwap>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep("idle")
                    setConfirmationText("")
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
