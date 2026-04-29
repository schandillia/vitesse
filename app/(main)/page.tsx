import Link from "next/link"
import { siteConfig } from "@/config/site"
import type { Metadata } from "next"
import { ArrowRight, Zap, Shield, BarChart3, CreditCard } from "lucide-react"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.home.title,
  description: siteConfig.seo.metaData.home.description,
}

const highlights = [
  {
    icon: Zap,
    title: "Blazing fast",
    description:
      "Built on modern infrastructure so your users never wait. Every page loads instantly.",
  },
  {
    icon: Shield,
    title: "Secure by default",
    description:
      "Rate limiting, CSP headers, and session protection are on from day one.",
  },
  {
    icon: BarChart3,
    title: "Built-in analytics",
    description:
      "Understand how your users behave and where they drop off — without leaving your dashboard.",
  },
  {
    icon: CreditCard,
    title: "Payments ready",
    description:
      "Accept one-time payments or subscriptions. Webhooks, receipts, and billing portals included.",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col gap-28 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-8 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-muted-foreground text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {/* Replace with your tagline or announcement */}
          Now in public beta — try it free
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
          {/* Replace with your product headline */}
          The better way to
          <br />
          <span className="text-primary">run your business</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
          {/* Replace with your product description */}
          {`${siteConfig.brand.name} helps teams move faster, collaborate smarter, and ship with confidence. Everything you need, nothing you don’t.`}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center gap-2 border border-border bg-background text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
          >
            See what&rsquo;s included
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          No credit card required · Cancel anytime
        </p>
      </section>

      {/* Highlights */}
      <section className="flex flex-col gap-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {/* Replace with your value proposition */}
            Why teams choose {siteConfig.brand.name}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            {/* Replace with supporting copy */}
            We&rsquo;ve thought through the hard parts so you don&rsquo;t have
            to.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Social proof */}
      <section className="flex flex-col items-center gap-6 text-center">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          {/* Replace with real logos or remove this section */}
          Trusted by teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
          {["Acme Corp", "Globex", "Initech", "Umbrella", "Dunder Mifflin"].map(
            (name) => (
              <span
                key={name}
                className="text-lg font-bold text-foreground tracking-tight"
              >
                {name}
              </span>
            )
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section className="rounded-2xl border border-border bg-card px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {/* Replace with your CTA headline */}
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mt-1">
            Join thousands of teams already using {siteConfig.brand.name}.
          </p>
        </div>
        <Link
          href="/pricing"
          className="shrink-0 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          View pricing
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  )
}
