import { siteConfig } from "@/config/site"
import type { Metadata } from "next"

interface BuildAuthorMetadataInput {
  authorName: string
  username: string
  siteUrl: string
  authorImage?: string | null
  twitterHandle?: string | null
}

export function buildAuthorMetadata({
  authorName,
  username,
  siteUrl,
  authorImage,
  twitterHandle,
}: BuildAuthorMetadataInput): Metadata {
  const url = `${siteUrl}/blog/author/${username}`
  const title = `${authorName} | Blog`
  const socialTitle = `${title} | ${siteConfig.brand.name}`
  const description = `All posts by ${authorName}.`
  const image = authorImage ?? `${siteConfig.brand.url}/opengraph-image.png`

  const creator = twitterHandle ?? siteConfig.brand.socials.twitter

  return {
    title,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      type: "profile",
      url,
      title: socialTitle,
      description,
      siteName: siteConfig.brand.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: authorName,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
      creator,
    },
  }
}
