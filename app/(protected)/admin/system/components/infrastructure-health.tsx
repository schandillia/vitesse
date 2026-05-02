"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCwIcon } from "lucide-react"
import {
  HealthCard,
  HealthLegend,
} from "@/app/(protected)/admin/system/components/health-card"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"

const DB_THRESHOLDS = { good: 200, degraded: 500 }
const CACHE_THRESHOLDS = { good: 50, degraded: 150 }

interface HealthResult {
  healthy: boolean
  latencyMs: number | null
  error?: string
}

interface InfrastructureHealthProps {
  initialDb: HealthResult
  initialCache: HealthResult
}

export function InfrastructureHealth({
  initialDb,
  initialCache,
}: InfrastructureHealthProps) {
  const [db, setDb] = useState<HealthResult>(initialDb)
  const [cache, setCache] = useState<HealthResult>(initialCache)
  const [checkedAt, setCheckedAt] = useState<Date | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleRefresh() {
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/health")
        if (!res.ok) return
        const data = await res.json()
        setDb(data.db)
        setCache(data.cache)
        setCheckedAt(new Date(data.checkedAt))
      } catch {
        // silently ignore network errors
      }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <GatedPageSubheading text="Infrastructure" />
          <div className="flex items-center gap-3">
            {checkedAt && (
              <p className="text-xs text-muted-foreground">
                Last checked{" "}
                {checkedAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isPending}
            >
              <RefreshCwIcon
                className={`size-3.5 ${isPending ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <HealthCard name="Database" {...db} thresholds={DB_THRESHOLDS} />
          <HealthCard name="Cache" {...cache} thresholds={CACHE_THRESHOLDS} />
        </div>
      </div>

      <HealthLegend
        dbThresholds={DB_THRESHOLDS}
        cacheThresholds={CACHE_THRESHOLDS}
      />
    </div>
  )
}
