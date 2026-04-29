import { siteConfig } from "@/config/site"

export function buildAuthorJsonLd(
  author: {
    name: string
    bio?: string | null
    username: string
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

      // optional future-proofing
      // image: "...",
      // sameAs: ["https://twitter.com/...", ...]
    },

    publisher: {
      "@type": "Organization",
      name: siteConfig.brand.name,
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }
}
