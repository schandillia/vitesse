import { siteConfig } from "@/config/site"

export function organizationSchema() {
  return {
    "@type": "Organization",

    "@id": `${siteConfig.brand.url}/#organization`,

    name: siteConfig.brand.name,

    url: siteConfig.brand.url,

    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.brand.url}/opengraph-image.png`,
    },
  }
}
