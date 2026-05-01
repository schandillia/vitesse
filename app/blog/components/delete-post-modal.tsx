"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { ConfirmModal } from "@/components/confirm-modal"
import { deletePostAction } from "@/actions/delete-post"

interface DeletePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
}

export function DeletePostModal({
  open,
  onOpenChange,
  postId,
}: DeletePostModalProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deletePostAction(postId)

      if (res.success) {
        onOpenChange(false)
        router.push("/blog")
      } else {
        console.error(res.error)
      }
    })
  }

  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete post?"
      description="This action cannot be undone. This will permanently remove your post!"
      confirmLabel="Delete"
      variant="destructive"
      isLoading={isPending}
      onConfirm={handleDelete}
    />
  )
}
