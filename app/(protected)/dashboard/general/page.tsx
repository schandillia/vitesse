import { GatedPageTitle } from "@/components/layout/gated-page-title"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.dashboard.title,
  description: siteConfig.seo.metaData.dashboard.description,
  robots: siteConfig.seo.metaData.dashboard.robots,
}

// ── Placeholder data — replace with real DB queries ──────────────────────────

const stats = [
  {
    label: "Total Revenue",
    value: "$24,563",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    // Replace with: await db.query.orders.aggregate(...)
  },
  {
    label: "Active Users",
    value: "1,429",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    // Replace with: await db.query.users.count(...)
  },
  {
    label: "Conversion Rate",
    value: "3.24%",
    change: "-0.4%",
    trend: "down",
    icon: TrendingUp,
    // Replace with: derived from your analytics provider
  },
  {
    label: "Active Sessions",
    value: "284",
    change: "+19.1%",
    trend: "up",
    icon: Activity,
    // Replace with: real-time data from your monitoring stack
  },
]

const chartData = [
  { month: "Aug", value: 40 },
  { month: "Sep", value: 55 },
  { month: "Oct", value: 47 },
  { month: "Nov", value: 62 },
  { month: "Dec", value: 58 },
  { month: "Jan", value: 75 },
  { month: "Feb", value: 68 },
  { month: "Mar", value: 82 },
  { month: "Apr", value: 79 },
  { month: "May", value: 91 },
  { month: "Jun", value: 88 },
  { month: "Jul", value: 96 },
]

const recentActivity = [
  // Replace with: await db.query.activity.findMany({ limit: 5, orderBy: desc })
  {
    id: "1",
    user: "Sarah Chen",
    email: "sarah@example.com",
    action: "Upgraded to Pro",
    amount: "$49.00",
    status: "completed",
    date: "2 min ago",
  },
  {
    id: "2",
    user: "James Miller",
    email: "james@example.com",
    action: "New signup",
    amount: "—",
    status: "completed",
    date: "14 min ago",
  },
  {
    id: "3",
    user: "Priya Nair",
    email: "priya@example.com",
    action: "Payment failed",
    amount: "$19.00",
    status: "failed",
    date: "1 hr ago",
  },
  {
    id: "4",
    user: "Tom Erikson",
    email: "tom@example.com",
    action: "Cancelled subscription",
    amount: "—",
    status: "cancelled",
    date: "3 hr ago",
  },
  {
    id: "5",
    user: "Aiko Tanaka",
    email: "aiko@example.com",
    action: "Upgraded to Pro",
    amount: "$49.00",
    status: "completed",
    date: "5 hr ago",
  },
]

const maxChartValue = Math.max(...chartData.map((d) => d.value))

const statusStyles: Record<string, string> = {
  completed: "bg-green-500/10 text-green-600 dark:text-green-400",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
}

// ─────────────────────────────────────────────────────────────────────────────

export default async function DashboardGeneralPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  const firstName = user.name?.split(" ")[0] ?? "there"

  return (
    <div className="container space-y-5">
      {/* Title + greeting */}
      <div className="flex flex-col gap-1">
        <GatedPageTitle
          title="Dashboard"
          description={`Welcome back, ${firstName}. Here’s what’s happening today`}
        />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isUp = stat.trend === "up"
          return (
            <div
              key={stat.label}
              className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span
                  className={`flex items-center gap-0.5 text-xs font-semibold ${
                    isUp
                      ? "text-green-600 dark:text-green-400"
                      : "text-destructive"
                  }`}
                >
                  {isUp ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      <div className="flex flex-col gap-4 p-5 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground text-sm">
              Revenue over time
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {/* Replace with real date range from your query */}
              Last 12 months
            </p>
          </div>
          {/* Replace with a real date range picker */}
          <span className="text-xs text-muted-foreground border border-border rounded-md px-2 py-1">
            Monthly
          </span>
        </div>

        {/* Bar chart — replace with Recharts or your preferred charting library */}
        <div className="flex items-end gap-1.5 h-40 w-full">
          {chartData.map((bar) => (
            <div
              key={bar.month}
              className="flex flex-col items-center gap-1 flex-1 h-full justify-end"
            >
              <div
                className="w-full rounded-md bg-primary/80 hover:bg-primary transition-colors"
                style={{ height: `${(bar.value / maxChartValue) * 100}%` }}
              />
              <span className="text-[10px] text-muted-foreground">
                {bar.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity table */}
      <div className="flex flex-col gap-4 p-5 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground text-sm">
            Recent activity
          </h2>
          {/* Replace with a link to your full activity log */}
          <span className="text-xs text-primary cursor-pointer hover:underline underline-offset-4">
            View all
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground font-medium pb-2 pr-4">
                  User
                </th>
                <th className="text-left text-xs text-muted-foreground font-medium pb-2 pr-4">
                  Action
                </th>
                <th className="text-left text-xs text-muted-foreground font-medium pb-2 pr-4">
                  Amount
                </th>
                <th className="text-left text-xs text-muted-foreground font-medium pb-2 pr-4">
                  Status
                </th>
                <th className="text-left text-xs text-muted-foreground font-medium pb-2">
                  When
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentActivity.map((row) => (
                <tr key={row.id}>
                  <td className="py-3 pr-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground text-xs">
                        {row.user}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {row.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground">
                    {row.action}
                  </td>
                  <td className="py-3 pr-4 text-xs text-foreground font-medium">
                    {row.amount}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        statusStyles[row.status]
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-muted-foreground">
                    {row.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
