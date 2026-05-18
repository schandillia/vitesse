import { siteConfig } from "@/config/site"

export function buildAuthorJsonLd(
  author: {
    name: string
    bio?: string | null
    username: string
    image?: string | null
    twitter?: string | null
  },
  siteUrl: string
) {
  const url = `${siteUrl}/blog/author/${author.username}`

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",

    mainEntity: {
      "@type": "Person",
      name: author.name,
      description: author.bio ?? `All posts by ${author.name}`,
      url,

      image: author.image ?? undefined,

      sameAs: author.twitter
        ? [`https://twitter.com/${author.twitter.replace(/^@/, "")}`]
        : undefined,
    },

    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.brand.url}/#organization`,
    },
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }
}
