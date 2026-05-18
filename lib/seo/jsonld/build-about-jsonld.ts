import { siteConfig } from "@/config/site"

export function buildAboutJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",

    name: `About | ${siteConfig.brand.name}`,

    description: siteConfig.seo.metaData.about.description,

    url: `${siteConfig.brand.url}/about`,

    mainEntity: {
      "@type": "Organization",
      "@id": `${siteConfig.brand.url}/#organization`,
    },
  }
}
