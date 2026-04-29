import { siteConfig } from "@/config/site"
import type { Metadata } from "next"

interface BuildAuthorMetadataInput {
  authorName: string
  username: string
  siteUrl: string
}

export function buildAuthorMetadata({
  authorName,
  username,
  siteUrl,
}: BuildAuthorMetadataInput): Metadata {
  const url = `${siteUrl}/blog/author/${username}`
  const title = `${authorName} | Blog`
  const description = `All posts by ${authorName}.`

  return {
    title,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      type: "profile",
      url,
      title,
      description,
      siteName: siteConfig.brand.name,
    },

    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}
