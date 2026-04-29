import { siteConfig } from "@/config/site"

export function buildCategoryJsonLd(
  category: {
    name: string
    slug: string
    description?: string | null
  },
  siteUrl: string
) {
  const url = `${siteUrl}/blog/category/${category.slug}`

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    name: category.name,
    description: category.description ?? `Posts in ${category.name}.`,

    url,

    isPartOf: {
      "@type": "Blog",
      name: siteConfig.brand.name,
      url: `${siteUrl}/blog`,
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }
}
