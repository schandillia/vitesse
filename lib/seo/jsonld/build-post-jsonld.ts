import { siteConfig } from "@/config/site"

export function buildPostJsonLd(
  post: {
    title: string
    excerpt?: string | null
    logline?: string | null
    createdAt: Date
    updatedAt?: Date | null
    author?: {
      name: string
      username: string
    } | null
    slug: string
  },
  siteUrl: string
) {
  const url = `${siteUrl}/blog/${post.slug}`

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.logline || "",
    image: [`${siteConfig.brand.url}/blog/${post.slug}/opengraph-image`],
    author: {
      "@type": "Person",
      name: post.author?.name ?? "Deleted User",
      url: post.author
        ? `${siteUrl}/blog/author/${post.author.username}`
        : undefined,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.brand.url}/#organization`,
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: (post.updatedAt || post.createdAt).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
  }
}
