import { buildPostJsonLd } from "@/lib/build-post-jsonld"
import { siteConfig } from "@/config/site"
import { getPostBySlug } from "@/actions/get-post-by-slug"
import { formatDate } from "@/lib/date"
import { notFound } from "next/navigation"
import Image from "next/image"
import { imageSizes } from "@/lib/image-sizes"
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer"
import Link from "next/link"
import { BlogBreadcrumbs } from "@/app/blog/components/blog-breadcrumbs"
import { canEditPost } from "@/lib/blog-utils"
import { PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UnpublishButton } from "@/app/blog/components/unpublish-button"
import { buildPostMetadata } from "@/lib/build-post-metadata"
import { buildBreadcrumbJsonLd } from "@/lib/build-breadcrumb-jsonld"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600 // Revalidate this page every 60 minutes (ISR)

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getPostBySlug((await params).slug)
  if (!post) return {}

  return buildPostMetadata(post, `${siteConfig.brand.url}/blog/${post.slug}`)
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const canEdit = await canEditPost(post.authorId)

  const isUpdated =
    post.updatedAt && formatDate(post.updatedAt) !== formatDate(post.createdAt)

  const breadcrumbJsonLd = buildBreadcrumbJsonLd({
    items: [
      { name: "Home", url: siteConfig.brand.url },
      { name: "Blog", url: `${siteConfig.brand.url}/blog` },
      { name: post.title, url: `${siteConfig.brand.url}/blog/${post.slug}` },
    ],
  })

  const jsonLd = buildPostJsonLd(post, siteConfig.brand.url)

  return (
    <article className="pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* HERO — full bleed with overlay */}
      <div className="relative w-full h-[55vh] md:h-[50vh]">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes={imageSizes.hero}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-600" />
        )}

        {/* Dark gradient scrim so text is legible */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

        {/* Breadcrumbs at top */}
        <div className="absolute top-0 left-0 right-0 px-6 pt-4 md:px-16 max-w-5xl mx-auto">
          <div className="rounded-full px-3 py-1 w-fit bg-white/20 backdrop-blur-sm inline-block [&_a]:text-white [&_li]:text-white [&_span]:text-white [&_svg]:text-white">
            <BlogBreadcrumbs postTitle={post.title} className="mb-0" />
          </div>
        </div>

        {/* Overlaid title section */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-8 md:px-16 md:pb-12 max-w-5xl mx-auto w-full left-0 right-0 pointer-events-none">
          <div className="space-y-3 text-white pointer-events-auto">
            {post.category && (
              <Link
                href={`/blog/category/${post.category.slug}`}
                className="text-xs font-medium bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full hover:bg-white/30 transition-colors w-fit inline-block"
              >
                {post.category.name}
              </Link>
            )}
            <h1 className="text-4xl/tight md:text-5xl/tight font-bold">
              {post.title}
            </h1>
            {post.logline && (
              <h2 className="text-xl/tight md:text-2xl/tight text-white/80">
                {post.logline}
              </h2>
            )}
            <div className="flex flex-col gap-2 text-white/70 pt-2 md:flex-row md:items-center md:justify-between md:gap-3">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                <span className="flex items-center gap-2">
                  {post.author.image && (
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      width={24}
                      height={24}
                      className="rounded-full object-cover"
                    />
                  )}
                  <Link
                    href={`/blog/author/${post.author.username}`}
                    className="hover:text-white transition-colors"
                  >
                    {post.author.name}
                  </Link>
                </span>
                <span className="text-white/40 hidden md:inline">|</span>
                <span className="space-x-1">
                  <time dateTime={post.createdAt.toISOString()}>
                    {formatDate(post.createdAt)}
                  </time>
                  {isUpdated && (
                    <time dateTime={post.updatedAt.toISOString()}>
                      (Updated {formatDate(post.updatedAt)})
                    </time>
                  )}
                </span>
              </div>
              {canEdit && (
                <div className="flex items-center gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link
                      href={`/blog/edit/${post.id}`}
                      className="flex items-center gap-1"
                    >
                      <PencilIcon className="size-4" />
                      Edit
                    </Link>
                  </Button>
                  <UnpublishButton postId={post.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT — constrained */}
      <div className="mx-auto max-w-4xl px-4 pt-10">
        <div className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed">
          <MarkdownRenderer source={post.content} />
        </div>
      </div>
    </article>
  )
}
