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
  const socialTitle = `${title} | ${siteConfig.brand.name}`
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
      title: socialTitle,
      description: desc,
      siteName: siteConfig.brand.name,
      images: [
        {
          url: `${siteConfig.brand.url}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: categoryName,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: desc,
      images: [`${siteConfig.brand.url}/opengraph-image.png`],
      creator: siteConfig.brand.socials.twitter,
    },
  }
}
