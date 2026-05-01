"use client"

import { useEffect, useRef, useState, useTransition, useCallback } from "react"
import { getPosts, type PostWithRelations } from "@/actions/get-posts"
import { PostCard } from "@/app/blog/components/post-card"
import { PostCardSkeletonGrid } from "@/app/blog/components/post-card-skeleton"
import { Loader2 } from "lucide-react"
import { BackToTop } from "@/components/back-to-top"

interface BlogFeedProps {
  initialPosts: PostWithRelations[]
  initialCursor: string | null
  initialHasMore: boolean
}

export function BlogFeed({
  initialPosts,
  initialCursor,
  initialHasMore,
}: BlogFeedProps) {
  const [posts, setPosts] = useState<PostWithRelations[]>(initialPosts)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [error, setError] = useState(false)
  const [isPending, startTransition] = useTransition()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const isLoadingRef = useRef(false)

  const loadMore = useCallback(() => {
    if (!cursor || isPending || isLoadingRef.current) return
    isLoadingRef.current = true
    setError(false)

    startTransition(async () => {
      const result = await getPosts(cursor)

      if (result.error) {
        setError(true)
        isLoadingRef.current = false
        return
      }

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id))
        const newPosts = result.posts.filter((p) => !existingIds.has(p.id))
        return [...prev, ...newPosts]
      })
      setCursor(result.nextCursor)
      setHasMore(result.hasMore)
      isLoadingRef.current = false
    })
  }, [cursor, isPending])

  // Scroll-triggered loading
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isPending) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isPending, loadMore])

  // Handle case where initial posts don't fill the screen
  useEffect(() => {
    if (!hasMore || isPending || isLoadingRef.current) return

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const timer = setTimeout(() => {
      const rect = sentinel.getBoundingClientRect()
      if (rect.top <= window.innerHeight) {
        loadMore()
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [posts]) // eslint-disable-line react-hooks/exhaustive-deps

  if (posts.length === 0 && !isPending) {
    return (
      <p className="text-muted-foreground col-span-2 text-center">
        No posts found.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="md:grid md:grid-cols-2 flex flex-col gap-10">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {isPending && <PostCardSkeletonGrid />}
      </div>

      {/* Sentinel — triggers next page load */}
      <div ref={sentinelRef} />

      {/* Loading spinner */}
      {isPending && (
        <div className="flex justify-center py-4">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm text-destructive">Failed to load more posts.</p>
          <button
            onClick={loadMore}
            className="text-sm underline text-muted-foreground hover:text-foreground"
          >
            Try again
          </button>
        </div>
      )}

      {/* No more posts */}
      {!hasMore && !isPending && posts.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          You&rsquo;ve reached the end.
        </p>
      )}
      <BackToTop />
    </div>
  )
}
