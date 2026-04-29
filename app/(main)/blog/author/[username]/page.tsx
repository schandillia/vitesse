import { buildAuthorMetadata } from "@/lib/build-author-metadata"
import { buildAuthorJsonLd } from "@/lib/build-author-jsonld"
import { siteConfig } from "@/config/site"
import { getPostsByAuthor } from "@/actions/get-posts-by-author"
import { BlogBreadcrumbs } from "@/app/(main)/blog/components/blog-breadcrumbs"
import { BlogFeed } from "@/app/(main)/blog/components/blog-feed"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { buildBreadcrumbJsonLd } from "@/lib/build-breadcrumb-jsonld"

interface AuthorPageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { username } = await params
  const { authorName } = await getPostsByAuthor(username)

  if (!authorName) return {}

  return buildAuthorMetadata({
    authorName,
    username,
    siteUrl: siteConfig.brand.url,
  })
}

export const revalidate = 3600

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { username } = await params
  const { posts, nextCursor, hasMore, authorName, authorBio } =
    await getPostsByAuthor(username)

  if (!authorName) notFound()

  const jsonLd = buildAuthorJsonLd(
    {
      name: authorName,
      bio: authorBio,
      username,
    },
    siteConfig.brand.url
  )

  const breadcrumbJsonLd = buildBreadcrumbJsonLd({
    items: [
      { name: "Home", url: siteConfig.brand.url },
      { name: "Blog", url: `${siteConfig.brand.url}/blog` },
      {
        name: authorName,
        url: `${siteConfig.brand.url}/blog/author/${username}`,
      },
    ],
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <BlogBreadcrumbs authorName={authorName} />
      <section className="flex flex-col gap-20 mx-auto">
        <header className="font-bold text-foreground text-center space-y-4">
          <h1 className="text-4xl/tight md:text-6xl">{authorName}</h1>
          <h2 className="text-2xl/tight md:text-4xl text-muted-foreground">
            {authorBio ?? `All posts by ${authorName}`}
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
