import type { Metadata } from "next"
import type { post } from "@/db/blog-schema"
import type { InferSelectModel } from "drizzle-orm"
import { siteConfig } from "@/config/site"

type Post = InferSelectModel<typeof post>

export function buildPostMetadata(post: Post, url: string): Metadata {
  const description = post.excerpt || post.logline || ""

  const image = post.coverImage
    ? post.coverImage
    : `${siteConfig.brand.url}/opengraph.png`

  return {
    title: `${post.title} | Blog`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      images: [{ url: image }],
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image],
    },
  }
}
