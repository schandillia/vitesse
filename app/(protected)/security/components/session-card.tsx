"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MonitorIcon,
  SmartphoneIcon,
  GlobeIcon,
  Trash2Icon,
} from "lucide-react"
import { authClient } from "@/lib/auth/auth-client"
import { formatDate } from "@/lib/date"
import { type SessionItem } from "@/actions/get-sessions"
import toast from "react-hot-toast"
import { Badge } from "@/components/ui/badge"

interface SessionCardProps {
  session: SessionItem
  isCurrentSession: boolean
  onRevoked: (id: string) => void
}

function parseDevice(userAgent: string | null): {
  icon: React.ReactNode
  label: string
} {
  if (!userAgent)
    return { icon: <GlobeIcon className="size-4" />, label: "Unknown device" }

  const ua = userAgent.toLowerCase()

  if (
    ua.includes("mobile") ||
    ua.includes("android") ||
    ua.includes("iphone")
  ) {
    return {
      icon: <SmartphoneIcon className="size-4" />,
      label: "Mobile device",
    }
  }

  return { icon: <MonitorIcon className="size-4" />, label: "Desktop device" }
}

function parseBrowser(userAgent: string | null): string {
  if (!userAgent) return "Unknown browser"

  if (userAgent.includes("Chrome") && !userAgent.includes("Edg"))
    return "Chrome"
  if (userAgent.includes("Firefox")) return "Firefox"
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    return "Safari"
  if (userAgent.includes("Edg")) return "Edge"
  if (userAgent.includes("OPR") || userAgent.includes("Opera")) return "Opera"

  return "Unknown browser"
}

export function SessionCard({
  session,
  isCurrentSession,
  onRevoked,
}: SessionCardProps) {
  const [isRevoking, setIsRevoking] = useState(false)
  const router = useRouter()
  const { icon, label } = parseDevice(session.userAgent)
  const browser = parseBrowser(session.userAgent)

  async function handleRevoke() {
    setIsRevoking(true)
    const { error } = await authClient.revokeSession({ token: session.token })
    setIsRevoking(false)

    if (error) {
      toast.error("Failed to revoke session.")
      return
    }

    toast.success("Session revoked.")
    onRevoked(session.id)
    router.refresh()
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            {icon}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">
                {label} · {browser}
              </CardTitle>
              {isCurrentSession && (
                <Badge className="text-xs px-1.5 py-0">Current</Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              {session.ipAddress ?? "IP unknown"} · Started{" "}
              {formatDate(session.createdAt)}
            </CardDescription>
            <CardDescription className="text-xs">
              {session.userAgent ?? "Unknown user agent"}
            </CardDescription>
          </div>
        </div>

        {!isCurrentSession && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleRevoke}
            disabled={isRevoking}
            title="Revoke session"
          >
            <Trash2Icon className="size-4" />
          </Button>
        )}
      </CardHeader>
    </Card>
  )
}
