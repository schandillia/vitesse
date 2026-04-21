import { siteConfig } from "@/config/site"
import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  CreditCard,
  Bell,
  Users,
  Globe,
  Puzzle,
} from "lucide-react"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.features.title,
  description: siteConfig.seo.metaData.features.description,
}

// Replace these feature groups with your actual product features
const featureGroups = [
  {
    icon: Zap,
    title: "Performance",
    description:
      "Built for speed from the ground up. Sub-second page loads, optimistic UI updates, and edge-ready infrastructure.",
    features: [
      "Server-side rendering out of the box",
      "Automatic image optimization",
      "Edge-compatible API routes",
      "Built-in caching layer",
    ],
  },
  {
    icon: Shield,
    title: "Security",
    description:
      "Enterprise-grade security that doesn’t require a security team to configure.",
    features: [
      "Role-based access control",
      "Rate limiting on all endpoints",
      "CSP headers by default",
      "Audit logging",
    ],
  },
  {
    icon: Users,
    title: "Team collaboration",
    description:
      "Built for teams. Invite members, assign roles, and manage permissions without writing a line of code.",
    features: [
      "Invite-based onboarding",
      "Granular permissions",
      "Activity feeds",
      "Real-time presence",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics & insights",
    description:
      "Understand what your users are doing, where they’re getting stuck, and what to build next.",
    features: [
      "User journey tracking",
      "Funnel analysis",
      "Retention cohorts",
      "Custom event tracking",
    ],
  },
  {
    icon: CreditCard,
    title: "Billing & payments",
    description:
      "Accept payments, manage subscriptions, and handle billing entirely from within your app.",
    features: [
      "One-time and recurring billing",
      "Usage-based pricing support",
      "Invoice generation",
      "Dunning management",
    ],
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "Keep users in the loop with transactional emails, in-app notifications, and webhooks.",
    features: [
      "Transactional email templates",
      "In-app notification center",
      "Webhook delivery",
      "Notification preferences",
    ],
  },
  {
    icon: Globe,
    title: "Internationalization",
    description:
      "Ship to a global audience with built-in i18n support, locale detection, and RTL layouts.",
    features: [
      "Multi-language support",
      "Automatic locale detection",
      "RTL layout support",
      "Currency formatting",
    ],
  },
  {
    icon: Puzzle,
    title: "Integrations",
    description:
      "Connect with the tools your team already uses. Slack, Zapier, and more — all pre-built.",
    features: [
      "Slack notifications",
      "Zapier integration",
      "REST API with docs",
      "Webhook subscriptions",
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="flex flex-col gap-16 py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {/* Replace with your features headline */}
          Everything your product needs
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {/* Replace with your features subheadline */}
          {siteConfig.brand.name} comes with a complete feature set out of the
          box. Stop stitching together tools and start shipping.
        </p>
      </div>

      {/* Feature groups grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featureGroups.map((group) => {
          const Icon = group.icon
          return (
            <div
              key={group.title}
              className="flex flex-col gap-4 p-6 rounded-xl border border-border bg-card"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">
                    {group.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                    {group.description}
                  </p>
                </div>
              </div>
              <ul className="flex flex-col gap-1.5 pl-1">
                {group.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          See pricing
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
