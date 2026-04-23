import { db } from "@/db/drizzle"
import { post } from "@/db/blog-schema"
import { desc, eq } from "drizzle-orm"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `Blog — ${siteConfig.brand.name}`,
  description: `Thoughts, updates, and insights from the ${siteConfig.brand.name} team.`,
}

export default async function BlogPage() {
  // 1. Fetch published posts from Neon via Drizzle
  const posts = await db.query.post.findMany({
    where: eq(post.published, true),
    orderBy: [desc(post.createdAt)],
    with: {
      category: true,
      author: true,
    },
  })

  return (
    <section className="flex flex-col gap-20 py-16 mx-auto">
      <header className="font-bold text-6xl text-foreground text-center">
        <h1>Minimal Blog</h1>
      </header>

      {/* 2. Map through the posts and render the grid */}
      <section className="md:grid md:grid-cols-2 flex flex-col gap-10">
        {posts.length === 0 ? (
          <p className="text-muted-foreground col-span-2 text-center">
            No posts found.
          </p>
        ) : (
          posts.map((p) => (
            <article
              key={p.id}
              className="flex flex-col gap-4 p-6 border rounded-xl hover:bg-muted/50 transition-colors"
            >
              {p.category && (
                <span className="text-sm font-medium text-primary">
                  {p.category.name}
                </span>
              )}

              <Link href={`/blog/${p.slug}`}>
                <h2 className="text-2xl font-bold hover:underline">
                  {p.title}
                </h2>
              </Link>

              {p.excerpt && (
                <p className="text-muted-foreground line-clamp-3">
                  {p.excerpt}
                </p>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto pt-4 border-t">
                <span>{p.author.name}</span>
                <span>•</span>
                <time dateTime={p.createdAt.toISOString()}>
                  {p.createdAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
            </article>
          ))
        )}
      </section>
    </section>
  )
}
