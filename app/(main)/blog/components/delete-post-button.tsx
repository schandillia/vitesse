"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2Icon } from "lucide-react"
import { DeletePostModal } from "@/app/(main)/blog/components/delete-post-modal"

interface DeletePostButtonProps {
  postId: string
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-destructive border-destructive hover:bg-destructive dark:hover:bg-destructive hover:text-white transition-colors"
      >
        <Trash2Icon className="size-4 shrink-0" />
        Delete
      </Button>

      <DeletePostModal open={open} onOpenChange={setOpen} postId={postId} />
    </>
  )
}
