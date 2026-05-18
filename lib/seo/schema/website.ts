import { siteConfig } from "@/config/site"

export function websiteSchema() {
  return {
    "@type": "WebSite",

    "@id": `${siteConfig.brand.url}/#website`,

    name: siteConfig.brand.name,

    url: siteConfig.brand.url,

    publisher: {
      "@id": `${siteConfig.brand.url}/#organization`,
    },
  }
}
