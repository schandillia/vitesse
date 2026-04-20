import type { Metadata } from "next"
import { siteConfig } from "@/config/site"

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.metaData.home.title,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.metaData.home.description,

  applicationName: siteConfig.name,

  authors: [{ name: siteConfig.name, url: siteConfig.url }],

  creator: siteConfig.name,

  publisher: siteConfig.name,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.metaData.home.title,
    description: siteConfig.metaData.home.description,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.metaData.home.title,
    description: siteConfig.metaData.home.description,
    images: ["/opengraph-image.png"],
    creator: `@${siteConfig.name.toLowerCase()}`,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-icon.png",
  },
}
