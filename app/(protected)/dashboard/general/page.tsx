import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  Bell,
  CreditCard,
  KeyRound,
  Shield,
  Activity,
  ArrowRight,
  User,
  Monitor,
} from "lucide-react"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.dashboard.title,
  description: siteConfig.seo.metaData.dashboard.description,
  robots: siteConfig.seo.metaData.dashboard.robots,
}

const quickActions = [
  {
    title: "Account Settings",
    description: "Manage your account and sign-in methods",
    href: "/settings/account",
    icon: User,
  },
  {
    title: "Security",
    description: "Manage passkeys and active sessions",
    href: "/security/authentication",
    icon: Shield,
  },
  {
    title: "Billing",
    description: "View your subscription and invoices",
    href: "/settings/billing",
    icon: CreditCard,
  },
  {
    title: "API Keys",
    description: "Create and manage developer keys",
    href: "/developer/api",
    icon: KeyRound,
  },
]

const recentActivity = [
  {
    id: "1",
    label: "Signed in successfully",
    description: "Desktop device · Edge browser",
    time: "Today",
    icon: Shield,
  },
  {
    id: "2",
    label: "Session created",
    description: "New login detected on this device",
    time: "Today",
    icon: Monitor,
  },
  {
    id: "3",
    label: "Notifications updated",
    description: "Product update preferences changed",
    time: "Yesterday",
    icon: Bell,
  },
]

export default async function DashboardGeneralPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  const firstName = user.name?.split(" ")[0] ?? "there"

  return (
    <div className="container space-y-6">
      <GatedPageTitle
        title="Home"
        description={`Welcome back, ${firstName}. Here’s an overview of your account and workspace`}
      />

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Account
            </h2>
            <User className="h-4 w-4 text-primary" />
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-lg font-semibold text-foreground">
              {user.name ?? "Unnamed User"}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Security
            </h2>
            <Shield className="h-4 w-4 text-primary" />
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-lg font-semibold text-foreground">Protected</p>
            <p className="text-sm text-muted-foreground">
              Manage sessions, passkeys, and sign-in activity
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Workspace Status
            </h2>
            <Activity className="h-4 w-4 text-primary" />
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              Operational
            </p>
            <p className="text-sm text-muted-foreground">
              All systems are functioning normally
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-foreground">
            Quick Actions
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Access your most commonly used settings and tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-xl border border-border bg-background/40 p-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-medium text-foreground">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-foreground">
            Recent Activity
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Recent account and security events
          </p>
        </div>

        <div className="space-y-3">
          {recentActivity.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.id}
                className="flex items-start gap-4 rounded-lg border border-border bg-background/40 p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>

                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
