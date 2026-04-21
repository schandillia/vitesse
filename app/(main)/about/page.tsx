import { siteConfig } from "@/config/site"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.about.title,
  description: siteConfig.seo.metaData.about.description,
}

const values = [
  {
    title: "Customer obsessed",
    // Replace with your own value
    body: "Everything we build starts with a customer problem. We ship fast, listen closely, and iterate relentlessly.",
  },
  {
    title: "Default to transparency",
    // Replace with your own value
    body: "We share what we’re working on, what broke, and what we learned. No spin, no corporate speak.",
  },
  {
    title: "Quality over quantity",
    // Replace with your own value
    body: "We’d rather do fewer things exceptionally well than many things adequately.",
  },
]

const team = [
  // Replace with real team members
  {
    name: "Jane Doe",
    role: "Co-founder & CEO",
    bio: "Previously built and sold two B2B SaaS companies. Passionate about developer tooling and great UX.",
  },
  {
    name: "John Smith",
    role: "Co-founder & CTO",
    bio: "Former staff engineer at a Fortune 500. Obsessed with performance, reliability, and clean APIs.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-20 py-16 max-w-2xl mx-auto">
      {/* Mission */}
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {/* Replace with your mission statement */}
          We&rsquo;re building the tools
          <br />
          we always wanted
        </h1>
        <div className="flex flex-col gap-4 text-muted-foreground leading-relaxed">
          {/* Replace with your company story */}
          <p>
            {siteConfig.brand.name} started because we were frustrated. Every
            new project meant the same tedious setup — the same integrations,
            the same decisions, the same week lost before writing a single line
            of meaningful code.
          </p>
          <p>
            We built {siteConfig.brand.name} for ourselves first. Then we
            realized other teams had the same problem. So we packaged it up,
            polished it, and made it available to everyone.
          </p>
          <p>
            Today we&rsquo;re a small, focused team shipping fast and staying
            close to our customers. We think that&rsquo;s how good software gets
            made.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold text-foreground">What we believe</h2>
        <div className="flex flex-col gap-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex flex-col gap-1.5 p-5 rounded-xl border border-border bg-card"
            >
              <h3 className="font-semibold text-foreground text-sm">
                {value.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold text-foreground">The team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card"
            >
              {/* Replace with real avatar image */}
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {member.name}
                </p>
                <p className="text-primary text-xs font-medium">
                  {member.role}
                </p>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Get started
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 border border-border bg-background text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
        >
          Get in touch
        </Link>
      </div>
    </div>
  )
}
