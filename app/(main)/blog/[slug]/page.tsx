import { buildPostJsonLd } from "@/lib/build-post-jsonld"
import { siteConfig } from "@/config/site"
import { getPostBySlug } from "@/actions/get-post-by-slug"
import { formatDate } from "@/lib/date"
import { notFound } from "next/navigation"
import Image from "next/image"
import { imageSizes } from "@/lib/image-sizes"
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer"
import Link from "next/link"
import { BlogBreadcrumbs } from "@/app/(main)/blog/components/blog-breadcrumbs"
import { canEditPost } from "@/lib/blog-utils"
import { PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UnpublishButton } from "@/app/(main)/blog/components/unpublish-button"
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
    <article className="mx-auto max-w-4xl pb-10 px-4">
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

      <BlogBreadcrumbs postTitle={post.title} />
      <header className="mb-8 space-y-4 text-center md:text-left">
        <div className="space-y-2">
          {post.category && (
            <Link
              href={`/blog/category/${post.category.slug}`}
              className="text-xs font-medium bg-muted text-muted-foreground px-2.5 py-1 rounded-full hover:bg-muted/70 transition-colors w-fit"
            >
              {post.category.name}
            </Link>
          )}
          <h1 className="text-4xl/tight md:text-5xl/tight font-bold">
            {post.title}
          </h1>
          {post.logline && (
            <h2 className="text-xl/tight md:text-2xl/tight">{post.logline}</h2>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 text-muted-foreground">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-3 justify-center md:justify-start">
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
              <Link href={`/blog/author/${post.author.username}`}>
                {post.author.name}
              </Link>
            </span>

            <span className="text-neutral-400">|</span>

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

          {/* RIGHT SIDE (YOUR BUTTONS) */}
          {canEdit && (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
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
      </header>

      {/* If you have a featured image */}
      {post.coverImage && (
        <div className="relative aspect-video mb-10 overflow-hidden rounded-xl border">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes={imageSizes.hero}
            className="object-cover"
          />
        </div>
      )}

      {/* The main content area */}
      <div className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed">
        <MarkdownRenderer source={post.content} />
      </div>
    </article>
  )
}
