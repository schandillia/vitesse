import { siteConfig } from "@/config/site"

interface BuildDocsJsonLdInput {
  title: string
  description: string
  canonical: string
}

export function buildDocsJsonLd({
  title,
  description,
  canonical,
}: BuildDocsJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",

    headline: title,

    description,

    url: canonical,

    author: {
      "@type": "Organization",
      "@id": `${siteConfig.brand.url}/#organization`,
    },

    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.brand.url}/#organization`,
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  }
}
