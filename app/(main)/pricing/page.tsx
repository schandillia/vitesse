import { siteConfig } from "@/config/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.pricing.title,
  description: siteConfig.seo.metaData.pricing.description,
}

export default function PricingPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Pricing</h1>
      <p className="text-lg text-muted-foreground">
        Our pricing is simple and transparent. Choose the plan that best suits
        your needs.
      </p>
      {/* Add your pricing details here */}
    </div>
  )
}
