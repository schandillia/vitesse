"use client"

import { Badge } from "@/components/ui/badge"
import { GoDotFill } from "react-icons/go"

type SaveStatus = "idle" | "saving" | "saved" | "error"

const statusConfig: Record<
  Exclude<SaveStatus, "idle">,
  { text: string; className: string }
> = {
  saving: { text: "Saving…", className: "text-amber-500 animate-pulse" },
  saved: { text: "Saved", className: "text-green-500" },
  error: { text: "Unable to save", className: "text-destructive animate-ping" },
}

export function SaveStatusBadge({ status }: { status: SaveStatus }) {
  return (
    <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0">
      <GoDotFill
        className={
          status === "idle" ? "text-green-500" : statusConfig[status].className
        }
      />
      {status === "idle" ? "Up to date" : statusConfig[status].text}
    </Badge>
  )
}
