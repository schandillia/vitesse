"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { useState } from "react"
import { TiptapToolbar } from "@/components/editor/tiptap-toolbar"

export function TiptapEditor() {
  const [title, setTitle] = useState("")
  const [logline, setLogline] = useState("")

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({}),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing…" }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "outline-none min-h-[500px] prose prose-neutral dark:prose-invert max-w-none leading-relaxed",
      },
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full bg-transparent text-4xl font-bold placeholder:text-muted-foreground/40 outline-none leading-tight"
      />
      <input
        value={logline}
        onChange={(e) => setLogline(e.target.value)}
        placeholder="Add a subtitle…"
        className="w-full bg-transparent text-xl placeholder:text-muted-foreground/40 outline-none leading-tight"
      />
      <div className="sticky top-14 z-40 bg-background/80 backdrop-blur -mx-4 px-4 py-2 border-b">
        <TiptapToolbar editor={editor} />
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
