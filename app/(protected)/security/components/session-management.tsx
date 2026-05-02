"use client"

import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { MonitorIcon } from "lucide-react"
import { SessionCard } from "@/app/(protected)/security/components/session-card"
import { type SessionItem } from "@/actions/get-sessions"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"

interface SessionManagementProps {
  initialSessions: SessionItem[]
  currentToken: string
}

export function SessionManagement({
  initialSessions,
  currentToken,
}: SessionManagementProps) {
  const [sessions, setSessions] = useState(initialSessions)

  function handleRevoked(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-2 max-w-2xl">
      <GatedPageSubheading text="Active Sessions" />

      {sessions.length === 0 ? (
        <Card className="border-muted/60 shadow-xs">
          <CardHeader className="flex flex-col items-center text-center py-10">
            <MonitorIcon className="h-10 w-10 text-muted-foreground mb-4" />
            <CardTitle>No active sessions</CardTitle>
            <CardDescription>
              You have no other active sessions.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              isCurrentSession={session.token === currentToken}
              onRevoked={handleRevoked}
            />
          ))}
        </div>
      )}
    </div>
  )
}
