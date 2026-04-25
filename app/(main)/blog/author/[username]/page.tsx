import { getPostsByAuthor } from "@/actions/get-posts-by-author"
import { BlogBreadcrumbs } from "@/app/(main)/blog/components/blog-breadcrumbs"
import { BlogFeed } from "@/app/(main)/blog/components/blog-feed"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface AuthorPageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { username } = await params
  const { authorName } = await getPostsByAuthor(username)

  if (!authorName) return {}

  return {
    title: `${authorName} | Blog`,
    description: `All posts by ${authorName}.`,
  }
}

export const revalidate = 3600

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { username } = await params
  const { posts, nextCursor, hasMore, authorName } =
    await getPostsByAuthor(username)

  if (!authorName) notFound()

  return (
    <>
      <BlogBreadcrumbs authorName={authorName} />
      <section className="flex flex-col gap-20 mx-auto">
        <header className="font-bold text-foreground text-center space-y-4">
          <h1 className="text-4xl/tight md:text-6xl">{authorName}</h1>
          <h2 className="text-2xl/tight md:text-4xl text-muted-foreground">
            All posts by this author
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
