import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Features",
  description: "Learn more about our features.",
}

export default function FeaturesPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Features</h1>
      <p className="text-lg text-muted-foreground">
        Our features are designed to help you succeed. Explore what we have to
        offer.
      </p>
      {/* Add your features details here */}
    </div>
  )
}
