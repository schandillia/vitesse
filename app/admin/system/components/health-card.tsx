import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HealthCardProps {
  name: string
  healthy: boolean
  latencyMs: number | null
  error?: string
  thresholds?: { good: number; degraded: number }
}

type LatencyGrade = "good" | "degraded" | "slow"
type OperationalStatus = "operational" | "degraded" | "outage"

const DEFAULT_THRESHOLDS = { good: 100, degraded: 300 }

function getLatencyGrade(
  latencyMs: number,
  thresholds: { good: number; degraded: number }
): LatencyGrade {
  if (latencyMs <= thresholds.good) return "good"
  if (latencyMs <= thresholds.degraded) return "degraded"
  return "slow"
}

function getOperationalStatus(
  healthy: boolean,
  latencyMs: number | null,
  thresholds: { good: number; degraded: number }
): OperationalStatus {
  if (!healthy) return "outage"
  if (latencyMs === null) return "outage"
  const grade = getLatencyGrade(latencyMs, thresholds)
  if (grade === "good") return "operational"
  return "degraded"
}

const statusConfig: Record<
  OperationalStatus,
  { label: string; dotClass: string; textClass: string; bgClass: string }
> = {
  operational: {
    label: "Operational",
    dotClass: "bg-emerald-500 animate-pulse",
    textClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-500/10",
  },
  degraded: {
    label: "Degraded",
    dotClass: "bg-amber-500 animate-pulse",
    textClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-500/10",
  },
  outage: {
    label: "Outage",
    dotClass: "bg-destructive",
    textClass: "text-destructive",
    bgClass: "bg-destructive/10",
  },
}

const latencyGradeConfig: Record<
  LatencyGrade,
  { label: string; className: string }
> = {
  good: {
    label: "Good",
    className: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
  degraded: {
    label: "Degraded",
    className: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  },
  slow: {
    label: "Slow",
    className: "text-destructive bg-destructive/10",
  },
}

export function HealthCard({
  name,
  healthy,
  latencyMs,
  error,
  thresholds = DEFAULT_THRESHOLDS,
}: HealthCardProps) {
  const status = getOperationalStatus(healthy, latencyMs, thresholds)
  const config = statusConfig[status]

  const grade =
    healthy && latencyMs !== null
      ? getLatencyGrade(latencyMs, thresholds)
      : null
  const gradeConfig = grade ? latencyGradeConfig[grade] : null

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        <div className={`p-2 rounded-full ${config.bgClass}`}>
          <span className={`block size-2.5 rounded-full ${config.dotClass}`} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <div className={`text-2xl font-bold ${config.textClass}`}>
          {config.label}
        </div>
        {latencyMs !== null ? (
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">{latencyMs} ms</p>
            {gradeConfig && (
              <span
                className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${gradeConfig.className}`}
              >
                {gradeConfig.label}
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {error ?? "Could not connect"}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface HealthLegendProps {
  dbThresholds: { good: number; degraded: number }
  cacheThresholds: { good: number; degraded: number }
}

export function HealthLegend({
  dbThresholds,
  cacheThresholds,
}: HealthLegendProps) {
  const rows: {
    status: OperationalStatus
    description: string
    dbRange: string
    cacheRange: string
  }[] = [
    {
      status: "operational",
      description: "Latency within normal range",
      dbRange: `< ${dbThresholds.good} ms`,
      cacheRange: `< ${cacheThresholds.good} ms`,
    },
    {
      status: "degraded",
      description: "Service up but latency elevated",
      dbRange: `${dbThresholds.good}–${dbThresholds.degraded} ms`,
      cacheRange: `${cacheThresholds.good}–${cacheThresholds.degraded} ms`,
    },
    {
      status: "outage",
      description: "Service unreachable",
      dbRange: "—",
      cacheRange: "—",
    },
  ]

  return (
    <div className="rounded-xl border shadow-none text-sm overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-4 px-4 py-2 bg-muted/50 text-xs font-medium text-muted-foreground border-b">
        <span>Status</span>
        <span>Description</span>
        <span>Database</span>
        <span>Cache</span>
      </div>
      {/* Rows */}
      {rows.map(({ status, description, dbRange, cacheRange }) => {
        const config = statusConfig[status]
        return (
          <div
            key={status}
            className="grid grid-cols-4 px-4 py-3 items-center border-b last:border-b-0"
          >
            <div className="flex items-center gap-2 font-medium text-foreground">
              <span
                className={`block size-2 rounded-full ${config.dotClass}`}
              />
              {config.label}
            </div>
            <span className="text-muted-foreground">{description}</span>
            <span className="font-mono text-muted-foreground">{dbRange}</span>
            <span className="font-mono text-muted-foreground">
              {cacheRange}
            </span>
          </div>
        )
      })}
    </div>
  )
}
