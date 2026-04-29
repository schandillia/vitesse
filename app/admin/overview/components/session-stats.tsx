import { StatCard } from "@/app/admin/overview/components/stat-card"
import { ActivityIcon } from "lucide-react"

interface SessionStatsProps {
  activeSessions: number
}

export function SessionStats({ activeSessions }: SessionStatsProps) {
  return (
    <StatCard
      title="Active Sessions"
      value={activeSessions}
      description="Currently active across all users"
      icon={ActivityIcon}
    />
  )
}
