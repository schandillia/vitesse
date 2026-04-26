"use client"

import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react"
import { Markdown } from "tiptap-markdown"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Typography from "@tiptap/extension-typography"
import TextAlign from "@tiptap/extension-text-align"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import CharacterCount from "@tiptap/extension-character-count"
import { useState } from "react"
import { TiptapToolbar } from "@/components/editor/tiptap-toolbar"
import { ImageNodeView } from "@/components/editor/image-node-view"
import { createPost } from "@/actions/create-post"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

const CustomImage = Image.configure({ inline: false }).extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: "",
        parseHTML: (element) =>
          element.querySelector("figcaption")?.textContent || "",
        renderHTML: (attributes) => ({
          caption: attributes.caption,
        }),
      },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  },
})

export function TiptapEditor() {
  const [title, setTitle] = useState("")
  const [logline, setLogline] = useState("")
  const [slug, setSlug] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({}),
      Typography,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Superscript,
      Subscript,
      Highlight.configure({ multicolor: false }),
      CharacterCount,
      CustomImage,
      Markdown.configure({
        html: false,
        transformPastedText: true,
      }),
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

  const handleSave = async (published: boolean) => {
    if (!editor) return
    setIsSaving(true)

    const getMarkdown = () => {
      const storage = editor.storage as unknown as {
        markdown: { getMarkdown: () => string }
      }
      return storage.markdown.getMarkdown()
    }

    const result = await createPost({
      title,
      slug,
      logline,
      content: getMarkdown(),
      published,
    })

    if (result.success) {
      toast.success(published ? "Post published!" : "Draft saved!")
      router.push(`/blog/${result.slug}`)
    } else {
      toast.error(result.error)
    }

    setIsSaving(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title…"
        className="w-full bg-transparent text-4xl font-bold placeholder:text-muted-foreground/40 outline-none leading-tight"
      />
      <input
        value={logline}
        onChange={(e) => setLogline(e.target.value)}
        placeholder="Add a subtitle…"
        className="w-full bg-transparent text-xl placeholder:text-muted-foreground/40 outline-none leading-tight"
      />
      <input
        value={slug}
        onChange={(e) =>
          setSlug(
            e.target.value
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, "")
          )
        }
        placeholder="post-slug…"
        className="w-full bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/40 outline-none font-mono"
      />
      <div className="sticky top-14 z-40 bg-background/80 backdrop-blur -mx-4 px-4 py-2 border-b">
        <TiptapToolbar editor={editor} />
      </div>
      <div className="[&_.ProseMirror_a]:cursor-pointer [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_img]:my-4">
        <EditorContent editor={editor} />
      </div>
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => handleSave(false)}
          disabled={isSaving}
        >
          Save draft
        </Button>
        <Button onClick={() => handleSave(true)} disabled={isSaving}>
          {isSaving ? "Publishing…" : "Publish"}
        </Button>
      </div>
    </div>
  )
}
