import { buildCategoryJsonLd } from "@/lib/build-category-jsonld"
import { buildBreadcrumbJsonLd } from "@/lib/build-breadcrumb-jsonld"
import { buildCategoryMetadata } from "@/lib/build-category-metadata"
import { siteConfig } from "@/config/site"
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
  const { categoryName, categoryDescription } = await getPostsByCategory(slug)

  if (!categoryName) return {}

  return buildCategoryMetadata({
    categoryName,
    categorySlug: slug,
    description: categoryDescription ?? `All posts in ${categoryName}.`,
    siteUrl: siteConfig.brand.url,
  })
}

export const revalidate = 3600

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const { posts, nextCursor, hasMore, categoryName, categoryDescription } =
    await getPostsByCategory(slug)

  if (!categoryName) notFound()

  const jsonLd = buildCategoryJsonLd(
    {
      name: categoryName,
      slug,
      description: categoryDescription,
    },
    siteConfig.brand.url
  )

  const breadcrumbJsonLd = buildBreadcrumbJsonLd({
    items: [
      { name: "Home", url: siteConfig.brand.url },
      { name: "Blog", url: `${siteConfig.brand.url}/blog` },
      {
        name: categoryName,
        url: `${siteConfig.brand.url}/blog/category/${slug}`,
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

      <BlogBreadcrumbs categoryName={categoryName} />
      <section className="flex flex-col gap-20 mx-auto">
        <header className="font-bold text-foreground text-center space-y-4">
          <h1 className="text-4xl/tight md:text-6xl">{categoryName}</h1>
          <h2 className="text-2xl/tight md:text-4xl text-muted-foreground">
            {categoryDescription ?? `All posts under ${categoryName}`}
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
