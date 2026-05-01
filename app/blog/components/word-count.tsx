"use client"

import type { Editor } from "@tiptap/react"

interface WordCountProps {
  editor: Editor | null
}

export function WordCount({ editor }: WordCountProps) {
  if (!editor) return null

  const words = editor.storage.characterCount.words()
  const chars = editor.storage.characterCount.characters()

  return (
    <div className="fixed bottom-4 right-4 text-xs text-muted-foreground bg-background/80 backdrop-blur px-3 py-1.5 rounded-full border">
      {words} {words === 1 ? "word" : "words"} · {chars}{" "}
      {chars === 1 ? "character" : "characters"}
    </div>
  )
}
