"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"

interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  title: React.ReactNode
  description?: string

  confirmLabel?: string
  cancelLabel?: string

  onConfirm: () => void
  isLoading?: boolean

  variant?: "default" | "destructive"
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isLoading = false,
  variant = "default",
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>

          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isLoading}
          >
            <LoadingSwap isLoading={isLoading}>{confirmLabel}</LoadingSwap>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
