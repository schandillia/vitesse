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
          url: `${siteUrl}/blog/category/${categorySlug}/opengraph-image`,
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
      images: [`${siteUrl}/blog/category/${categorySlug}/opengraph-image`],
      creator: siteConfig.brand.socials.twitter,
    },
  }
}
