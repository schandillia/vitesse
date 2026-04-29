import { siteConfig } from "@/config/site"
import type { Metadata } from "next"

interface BuildCategoryMetadataInput {
  categoryName: string
  categorySlug: string
  description?: string | null
  siteUrl: string
}

export function buildCategoryMetadata({
  categoryName,
  categorySlug,
  description,
  siteUrl,
}: BuildCategoryMetadataInput): Metadata {
  const url = `${siteUrl}/blog/category/${categorySlug}`
  const title = `${categoryName} | Blog`
  const desc = description ?? `Posts in ${categoryName}.`

  return {
    title,
    description: desc,

    alternates: {
      canonical: url,
    },

    openGraph: {
      type: "website",
      url,
      title,
      description: desc,
      siteName: siteConfig.brand.name,
    },

    twitter: {
      card: "summary",
      title,
      description: desc,
    },
  }
}
