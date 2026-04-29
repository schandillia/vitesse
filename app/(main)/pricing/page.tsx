import { siteConfig } from "@/config/site"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.pricing.title,
  description: siteConfig.seo.metaData.pricing.description,
}

// Replace these plans with your actual pricing
const plans = [
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    description: "For individuals and small teams just getting started.",
    features: [
      "Up to 3 users",
      "5 projects",
      "10GB storage",
      "Basic analytics",
      "Email support",
      "API access",
    ],
    cta: "Start free trial",
    href: "/login",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For growing teams that need more power and fewer limits.",
    features: [
      "Up to 20 users",
      "Unlimited projects",
      "100GB storage",
      "Advanced analytics",
      "Priority support",
      "API access",
      "Custom integrations",
      "SSO",
    ],
    cta: "Start free trial",
    href: "/login",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description:
      "For large teams with custom requirements and compliance needs.",
    features: [
      "Unlimited users",
      "Unlimited projects",
      "Unlimited storage",
      "Custom analytics",
      "Dedicated support",
      "SLA guarantee",
      "Custom contracts",
      "On-premise option",
    ],
    cta: "Contact us",
    href: "/contact",
    highlighted: false,
  },
]

// Replace with your actual FAQs
const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes — all paid plans include a 14-day free trial. No credit card required to start.",
  },
  {
    q: "Can I change plans later?",
    a: "Absolutely. Upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards and debit cards. Enterprise customers can pay via invoice.",
  },
  {
    q: "Do you offer discounts for annual billing?",
    a: "Yes — annual billing saves you 20% compared to monthly pricing.",
  },
  {
    q: "What happens when I cancel?",
    a: "You keep access until the end of your billing period. After that your account is downgraded to the free tier and your data is retained for 30 days.",
  },
]

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-20 py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {/* Replace with your pricing headline */}
          Simple pricing, no surprises
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {/* Replace with your pricing subheadline */}
          Start free, scale when you&rsquo;re ready. Cancel anytime.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col gap-6 p-6 rounded-xl border ${
              plan.highlighted
                ? "border-primary bg-primary/5 relative"
                : "border-border bg-card"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most popular
                </span>
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
              <p className="text-muted-foreground text-sm mt-1">
                {plan.description}
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">
                {plan.price}
              </span>
              {plan.period && (
                <span className="text-muted-foreground text-sm">
                  {plan.period}
                </span>
              )}
            </div>

            <ul className="flex flex-col gap-2 flex-1">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-opacity ${
                plan.highlighted
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "border border-border bg-background text-foreground hover:bg-muted transition-colors"
              }`}
            >
              {plan.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="flex flex-col gap-8 max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-foreground text-center">
          Frequently asked questions
        </h2>
        <div className="flex flex-col divide-y divide-border">
          {faqs.map((faq) => (
            <div key={faq.q} className="py-5 flex flex-col gap-2">
              <h3 className="font-semibold text-foreground text-sm">{faq.q}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
