import { siteConfig } from "@/config/site"

export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.metaData.home.description,
      },
      {
        "@type": "Organization",
        url: siteConfig.url,
        name: siteConfig.name,
        logo: `${siteConfig.url}/opengraph-image.png`,
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
