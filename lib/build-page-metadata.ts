import type { Metadata } from "next"
import { siteConfig } from "@/config/site"

interface BuildPageMetadataInput {
  title: string
  absoluteTitle?: boolean
  description: string
  canonical: string
  image?: string
  noIndex?: boolean
  section?: string
}

export function buildPageMetadata({
  title,
  absoluteTitle = false,
  description,
  canonical,
  image,
  noIndex = false,
  section,
}: BuildPageMetadataInput): Metadata {
  const resolvedImage = image ?? `${siteConfig.brand.url}/opengraph-image.png`
  const socialTitle = absoluteTitle
    ? title
    : section
      ? `${title} | ${section} | ${siteConfig.brand.name}`
      : `${title} | ${siteConfig.brand.name}`

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,

    alternates: { canonical },

    ...(noIndex && {
      robots: { index: false, follow: false },
    }),

    openGraph: {
      type: "website",
      url: canonical,
      title: socialTitle,
      description,
      siteName: siteConfig.brand.name,
      images: [{ url: resolvedImage, width: 1200, height: 630, alt: title }],
    },

    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [resolvedImage],
      creator: siteConfig.brand.socials.twitter,
    },
  }
}
