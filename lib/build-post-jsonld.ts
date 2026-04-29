import { siteConfig } from "@/config/site"

export function buildPostJsonLd(
  post: {
    title: string
    excerpt?: string | null
    logline?: string | null
    coverImage?: string | null
    createdAt: Date
    updatedAt?: Date | null
    author: { name: string }
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
    image: post.coverImage ? [post.coverImage] : [],
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.brand.name,
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: (post.updatedAt || post.createdAt).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }
}
