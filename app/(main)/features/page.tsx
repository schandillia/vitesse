import { siteConfig } from "@/config/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.features.title,
  description: siteConfig.seo.metaData.features.description,
}

export default function FeaturesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Features</h1>
      <p className="text-lg text-muted-foreground">
        Our features are designed to help you succeed. Explore what we have to
        offer.
      </p>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </p>
      {/* Add your features details here */}
    </div>
  )
}
