import { getPosts } from "@/actions/get-posts"
import { BlogFeed } from "@/app/(main)/blog/components/blog-feed"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import { ROLES } from "@/lib/auth/roles"
import { PlusIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.blog.title,
  description: siteConfig.seo.metaData.blog.description,
}

export const revalidate = 3600 // Revalidate this page every 60 minutes (ISR)

export default async function BlogPage() {
  const session = await getServerSession()
  const isAdmin = session?.user?.role === ROLES.ADMIN
  const { posts, nextCursor, hasMore } = await getPosts()

  return (
    <section className="flex flex-col gap-20 mx-auto">
      <header className="font-bold text-foreground text-center space-y-4">
        <h1 className="text-4xl/tight md:text-6xl">
          {siteConfig.blog.pageHeading}
        </h1>
        <h2 className="text-2xl/tight md:text-4xl">
          {siteConfig.blog.pageSubHeading}
        </h2>
        {isAdmin && (
          <Button asChild size="lg">
            <Link href="/admin/blog/new">
              <PlusIcon className="size-4" />
              Add Post
            </Link>
          </Button>
        )}
      </header>

      <BlogFeed
        initialPosts={posts}
        initialCursor={nextCursor}
        initialHasMore={hasMore}
      />
    </section>
  )
}
