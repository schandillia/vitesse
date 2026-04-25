import { getPostsByCategory } from "@/actions/get-posts-by-category"
import { BlogBreadcrumbs } from "@/app/(main)/blog/components/blog-breadcrumbs"
import { BlogFeed } from "@/app/(main)/blog/components/blog-feed"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const { categoryName } = await getPostsByCategory(slug)

  if (!categoryName) return {}

  return {
    title: `${categoryName} | Blog`,
    description: `All posts in ${categoryName}.`,
  }
}

export const revalidate = 3600

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const { posts, nextCursor, hasMore, categoryName } =
    await getPostsByCategory(slug)

  if (!categoryName) notFound()

  return (
    <>
      <BlogBreadcrumbs categoryName={categoryName} />
      <section className="flex flex-col gap-20 mx-auto">
        <header className="font-bold text-foreground text-center space-y-4">
          <h1 className="text-4xl/tight md:text-6xl">{categoryName}</h1>
          <h2 className="text-2xl/tight md:text-4xl text-muted-foreground">
            All posts in this category
          </h2>
        </header>

        <BlogFeed
          initialPosts={posts}
          initialCursor={nextCursor}
          initialHasMore={hasMore}
        />
      </section>
    </>
  )
}
