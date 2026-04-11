import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Learn more about our pricing plans.",
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
