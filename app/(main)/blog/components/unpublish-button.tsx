"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { updatePost } from "@/actions/update-post"
import { EyeOffIcon } from "lucide-react"

interface UnpublishButtonProps {
  postId: string
}

export function UnpublishButton({ postId }: UnpublishButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleUnpublish = () => {
    startTransition(async () => {
      const res = await updatePost({
        id: postId,
        published: false,
      })

      if (!res.success) {
        console.error(res.error)
        return
      }

      router.push("/blog")
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleUnpublish}
      disabled={isPending}
      className="flex items-center gap-1 text-destructive border-destructive/20 dark:border-destructive/20 hover:bg-destructive/10 dark:hover:bg-destructive/10 hover:text-destructive"
    >
      <LoadingSwap isLoading={isPending}>
        <span className="flex items-center gap-2">
          <EyeOffIcon className="size-4 shrink-0" />
          Unpublish
        </span>
      </LoadingSwap>
    </Button>
  )
}
