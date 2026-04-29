export const dynamic = "force-dynamic"

import { db } from "@/db/drizzle"
import { post } from "@/db/blog-schema"
import { eq } from "drizzle-orm"
import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

const {
  brand: { url },
} = siteConfig

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await db.query.post.findMany({
    where: eq(post.published, true),
    columns: {
      slug: true,
      updatedAt: true,
    },
  })

  const categories = await db.query.category.findMany({
    columns: {
      slug: true,
    },
  })

  const authors = await db.query.user.findMany({
    columns: {
      username: true,
    },
    with: {
      posts: {
        where: eq(post.published, true),
        columns: { id: true },
      },
    },
  })

  const validAuthors = authors.filter((a) => a.posts.length > 0)

  return [
    { url, lastModified: new Date(), changeFrequency: "yearly", priority: 1 },
    {
      url: `${url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${url}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${url}/features`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${url}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${url}/docs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${url}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${url}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${url}/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${url}/refund`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${url}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${url}/grievance`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${url}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${url}/credits`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${url}/security`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },

    // Blog index
    {
      url: `${url}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    // Posts
    ...posts.map((p) => ({
      url: `${url}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    // Categories
    ...categories.map((c) => ({
      url: `${url}/blog/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    // Authors
    ...validAuthors.map((a) => ({
      url: `${url}/blog/author/${a.username}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]
}
