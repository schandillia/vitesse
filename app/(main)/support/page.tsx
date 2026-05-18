import Link from "next/link"
import { siteConfig } from "@/config/site"
import { buildPageMetadata } from "@/lib/seo/metadata/build-page-metadata"

export const metadata = buildPageMetadata({
  title: siteConfig.seo.metaData.support.title,
  description: siteConfig.seo.metaData.support.description,
  canonical: `${siteConfig.brand.url}/support`,
})

const supportChannels = [
  {
    title: "Technical Support",
    description:
      "Get help with bugs, unexpected behavior, integrations, or platform issues.",
    href: "/contact",
    cta: "Contact support",
  },
  {
    title: "Billing & Account",
    description:
      "Questions about subscriptions, invoices, payments, or account access.",
    href: "/contact",
    cta: "Get billing help",
  },
  {
    title: "Documentation",
    description:
      "Browse guides, API references, setup instructions, and product documentation.",
    href: "/docs",
    cta: "View documentation",
  },
]

export default function SupportPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-4">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Support
        </h1>

        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Get help with technical issues, billing questions, account access, and
          platform support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        {supportChannels.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border bg-card p-6 flex flex-col"
          >
            <h2 className="text-lg font-semibold text-foreground">
              {item.title}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
              {item.description}
            </p>

            <Link
              href={item.href}
              className="mt-6 inline-flex text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              {item.cta}
            </Link>
          </div>
        ))}
      </div>

      <section className="mt-16 rounded-2xl border border-border bg-card p-8">
        <h2 className="text-xl font-semibold text-foreground">
          Support availability
        </h2>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-foreground">Response time</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Most inquiries receive a response within 1–2 business days.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Documentation</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Self-serve documentation is available 24/7 through the{" "}
              <Link className="underline underline-offset-4" href="/docs">
                docs portal
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
