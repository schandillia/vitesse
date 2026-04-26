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
import { useCallback, useEffect, useState } from "react"
import { TiptapToolbar } from "@/components/editor/tiptap-toolbar"
import { ImageNodeView } from "@/components/editor/image-node-view"
import { PostSettingsModal } from "@/components/editor/post-settings-modal"
import { createPost } from "@/actions/create-post"
import { getCategories, type CategoryOption } from "@/actions/get-categories"
import { Button } from "@/components/ui/button"
import { SettingsIcon } from "lucide-react"
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
  const [excerpt, setExcerpt] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const router = useRouter()

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

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

  const getMarkdown = useCallback(() => {
    const storage = editor?.storage as unknown as {
      markdown: { getMarkdown: () => string }
    }
    return storage?.markdown?.getMarkdown() ?? ""
  }, [editor])

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!editor) return
    const interval = setInterval(async () => {
      if (!title.trim() || !slug.trim()) return
      await createPost({
        title,
        slug,
        logline,
        excerpt,
        categoryId: categoryId || undefined,
        coverImage: coverImage || undefined,
        content: getMarkdown(),
        published: false,
      })
    }, 30000)
    return () => clearInterval(interval)
  }, [
    editor,
    title,
    slug,
    logline,
    excerpt,
    categoryId,
    coverImage,
    getMarkdown,
  ])

  const handlePublish = async () => {
    if (!slug.trim()) {
      toast.error("Slug is required before publishing")
      setSettingsOpen(true)
      return
    }

    setIsPublishing(true)

    const result = await createPost({
      title,
      slug,
      logline,
      excerpt,
      categoryId: categoryId || undefined,
      coverImage: coverImage || undefined,
      content: getMarkdown(),
      published: true,
    })

    if (result.success) {
      toast.success("Post published!")
      router.push(`/blog/${result.slug}`)
    } else {
      toast.error(result.error)
    }

    setIsPublishing(false)
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
      <div className="sticky top-14 z-40 bg-background/80 backdrop-blur -mx-4 px-4 py-2 border-b">
        <TiptapToolbar editor={editor} />
      </div>
      <div className="[&_.ProseMirror_a]:cursor-pointer [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_img]:my-4">
        <EditorContent editor={editor} />
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSettingsOpen(true)}
          title="Post settings"
        >
          <SettingsIcon className="size-4" />
          Settings
        </Button>
        <Button onClick={handlePublish} disabled={isPublishing} size="sm">
          {isPublishing ? "Publishing…" : "Publish"}
        </Button>
      </div>

      <PostSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        categories={categories}
        slug={slug}
        onSlugChange={setSlug}
        excerpt={excerpt}
        onExcerptChange={setExcerpt}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        coverImage={coverImage}
        onCoverImageChange={setCoverImage}
        onPublish={handlePublish}
        isPublishing={isPublishing}
      />
    </div>
  )
}
