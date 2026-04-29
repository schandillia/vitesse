"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { formatDate } from "@/lib/date"
import { updatePost } from "@/actions/update-post"
import { type DraftPost } from "@/actions/get-drafts"
import { SendIcon } from "lucide-react"
import toast from "react-hot-toast"
import { DeletePostButton } from "@/app/(main)/blog/components/delete-post-button"

interface DraftCardProps {
  draft: DraftPost
  onPublished: (id: string) => void
}

export function DraftCard({ draft, onPublished }: DraftCardProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const router = useRouter()

  const handlePublish = async () => {
    setIsPublishing(true)

    const result = await updatePost({ id: draft.id, published: true })

    if (result.success) {
      toast.success("Post published!")
      onPublished(draft.id)
      router.refresh()
    } else {
      toast.error(result.error ?? "Failed to publish post.")
      setIsPublishing(false)
    }
  }

  const displayTitle =
    draft.title === "Untitled" || !draft.title.trim()
      ? "Untitled Draft"
      : draft.title

  const description = draft.logline || draft.excerpt

  return (
    <article className="flex flex-col gap-4 p-6 border rounded-xl hover:bg-muted/50 transition-colors">
      <div className="flex flex-col gap-4">
        <Link href={`/blog/edit/${draft.id}`}>
          <h2 className="text-2xl font-bold">{displayTitle}</h2>
        </Link>
        {description && (
          <p className="text-muted-foreground line-clamp-3">{description}</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 mt-auto pt-4 border-t text-sm text-muted-foreground">
        <time dateTime={draft.updatedAt.toISOString()}>
          Last edited {formatDate(draft.updatedAt)}
        </time>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-1"
          >
            <LoadingSwap isLoading={isPublishing}>
              <span className="flex items-center gap-1">
                <SendIcon className="size-4 shrink-0" />
                Publish
              </span>
            </LoadingSwap>
          </Button>

          <DeletePostButton postId={draft.id} />
        </div>
      </div>
    </article>
  )
}
