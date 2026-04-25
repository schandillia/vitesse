import { getPostBySlug } from "@/actions/get-post-by-slug"
import { formatDate } from "@/lib/date"
import { notFound } from "next/navigation"
import Image from "next/image"
import { imageSizes } from "@/lib/image-sizes"
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer"
import Link from "next/link"
import { BlogBreadcrumbs } from "@/app/(main)/blog/components/blog-breadcrumbs"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600 // Revalidate this page every 60 minutes (ISR)

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const isUpdated =
    post.updatedAt && formatDate(post.updatedAt) !== formatDate(post.createdAt)

  return (
    <article className="mx-auto max-w-4xl pb-10 px-4">
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

        <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground">
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
          <span>•</span>
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
