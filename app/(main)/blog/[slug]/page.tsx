import { getPostBySlug } from "@/actions/get-post-by-slug"
import { formatDate } from "@/lib/date"
import { notFound } from "next/navigation"

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

  return (
    <article className="mx-auto max-w-3xl py-10 px-4">
      <header className="mb-8 space-y-4 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl/tight">
          {post.title}
        </h1>

        {post.logline && (
          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.logline}
          </p>
        )}

        <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground">
          <time dateTime={post.createdAt.toISOString()}>
            {formatDate(post.createdAt)}
          </time>
          <span>•</span>
          <span>{post.author.name}</span>
        </div>
      </header>

      {/* If you have a featured image */}
      {post.coverImage && (
        <div className="relative aspect-video mb-10 overflow-hidden rounded-xl border">
          <img
            src={post.coverImage}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {/* The main content area */}
      <div className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed">
        {/* If using raw HTML/Markdown, render it here */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  )
}
