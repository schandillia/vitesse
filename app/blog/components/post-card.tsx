import Link from "next/link"
import type { PostWithRelations } from "@/actions/get-posts"

export function PostCard({ post }: { post: PostWithRelations }) {
  return (
    <article className="flex flex-col gap-4 p-6 border rounded-xl hover:bg-muted/50 transition-colors">
      {post.category && (
        <Link
          href={`/blog/category/${post.category.slug}`}
          className="text-sm font-medium text-primary w-fit"
        >
          {post.category.name}
        </Link>
      )}

      <Link href={`/blog/${post.slug}`}>
        <h2 className="text-2xl font-bold">{post.title}</h2>
      </Link>

      {post.excerpt && (
        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
      )}

      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto pt-4 border-t">
        <Link
          href={`/blog/author/${post.author.username}`}
          className="text-primary"
        >
          {post.author.name}
        </Link>
        <span className="text-neutral-400">|</span>
        <time dateTime={post.createdAt.toISOString()}>
          {post.createdAt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
      </div>
    </article>
  )
}
