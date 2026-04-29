"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { type DraftPost } from "@/actions/get-drafts"
import { FileTextIcon } from "lucide-react"
import { DraftCard } from "@/app/(main)/blog/components/draft-card"

interface DraftsListProps {
  drafts: DraftPost[]
}

export function DraftsList({ drafts: initialDrafts }: DraftsListProps) {
  const [drafts, setDrafts] = useState(initialDrafts)

  const handlePublished = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id))
  }

  if (drafts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        <FileTextIcon className="size-8 opacity-40" />
        <div className="flex flex-col gap-1">
          <span className="font-medium">No drafts yet</span>
          <span className="text-sm">
            Posts you save without publishing will appear here.
          </span>
        </div>
        <Button asChild variant="outline" size="sm" className="mt-2">
          <Link href="/blog/edit/new">Create a post</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {drafts.map((draft) => (
        <DraftCard key={draft.id} draft={draft} onPublished={handlePublished} />
      ))}
    </div>
  )
}
