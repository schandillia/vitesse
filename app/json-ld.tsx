import { siteConfig } from "@/config/site"

export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        url: siteConfig.brand.url,
        name: siteConfig.brand.name,
        description: siteConfig.seo.metaData.home.description,
      },
      {
        "@type": "Organization",
        url: siteConfig.brand.url,
        name: siteConfig.brand.name,
        logo: `${siteConfig.brand.url}/opengraph-image.png`,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
