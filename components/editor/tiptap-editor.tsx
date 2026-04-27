"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { useAutosave } from "@/hooks/use-autosave"
import { Markdown } from "tiptap-markdown"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Typography from "@tiptap/extension-typography"
import TextAlign from "@tiptap/extension-text-align"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import Highlight from "@tiptap/extension-highlight"
import CharacterCount from "@tiptap/extension-character-count"
import { useCallback, useEffect, useState } from "react"
import { TiptapToolbar } from "@/components/editor/tiptap-toolbar"
import { PostSettingsModal } from "@/components/editor/post-settings-modal"
import { updatePost } from "@/actions/update-post"
import { getCategories, type CategoryOption } from "@/actions/get-categories"
import { Button } from "@/components/ui/button"
import { SettingsIcon } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { CustomImage } from "@/lib/custom-image"
import { SaveStatusBadge } from "@/components/editor/save-status-badge"

interface TiptapEditorProps {
  draftId: string
  initialTitle?: string
  initialLogline?: string
  initialSlug?: string
  initialContent?: string
  initialExcerpt?: string
  initialCategoryId?: string
  initialCoverImage?: string
}

export function TiptapEditor({
  draftId,
  initialTitle = "",
  initialLogline = "",
  initialSlug = "",
  initialContent = "",
  initialExcerpt = "",
  initialCategoryId = "",
  initialCoverImage = "",
}: TiptapEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [logline, setLogline] = useState(initialLogline)
  const [slug, setSlug] = useState(initialSlug)
  const [excerpt, setExcerpt] = useState(initialExcerpt)
  const [categoryId, setCategoryId] = useState(initialCategoryId)
  const [coverImage, setCoverImage] = useState(initialCoverImage)
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
      Markdown.configure({ html: false, transformPastedText: true }),
      Placeholder.configure({ placeholder: "Start writing…" }),
    ],
    content: initialContent,
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

  const { saveStatus, save } = useAutosave({
    draftId,
    title,
    logline,
    slug,
    excerpt,
    categoryId,
    coverImage,
    getMarkdown,
    editor,
  })

  const handlePublish = async () => {
    if (!title.trim() || title === "Untitled") {
      toast.error("Please set a title before publishing")
      return
    }
    if (!slug.trim() || slug.startsWith("draft-")) {
      setSettingsOpen(true)
      return
    }

    setIsPublishing(true)
    await save()

    const result = await updatePost({
      id: draftId,
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
      router.push(`/blog/${slug}`)
    } else {
      toast.error(result.error)
      setIsPublishing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end text-xs text-muted-foreground h-4">
        <SaveStatusBadge status={saveStatus} />
      </div>
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
          <LoadingSwap isLoading={isPublishing}>Publish</LoadingSwap>
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
        logline={logline}
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
