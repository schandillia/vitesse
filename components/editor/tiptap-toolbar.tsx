"use client"

import { uploadBlogImageAction } from "@/actions/upload-blog-image"
import { AlignmentSelector } from "@/components/editor/alignment-selector"
import { HeadingSelector } from "@/components/editor/heading-selector"
import { blogImageSchema } from "@/lib/validations/blog-image-schema"
import { useEditorState, type Editor } from "@tiptap/react"
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  CodeIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  LinkIcon,
  MinusIcon,
  UndoIcon,
  RedoIcon,
  SuperscriptIcon,
  SubscriptIcon,
  HighlighterIcon,
  ImageIcon,
} from "lucide-react"
import { useRef } from "react"
import toast from "react-hot-toast"

interface TiptapToolbarProps {
  editor: Editor | null
}

const buttonClass = (active: boolean) =>
  `p-2 rounded-md cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
    active
      ? "bg-muted text-foreground"
      : "text-muted-foreground hover:text-foreground hover:bg-muted"
  }`

export function TiptapToolbar({ editor }: TiptapToolbarProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return { canUndo: false, canRedo: false, words: 0 }
      return {
        canUndo: ctx.editor.can().undo(),
        canRedo: ctx.editor.can().redo(),
        words: ctx.editor.storage.characterCount?.words?.() ?? 0,
      }
    },
  })

  const canUndo = editorState?.canUndo ?? false
  const canRedo = editorState?.canRedo ?? false
  const words = editorState?.words ?? 0

  if (!editor) return null

  const setLink = () => {
    const url = window.prompt("Enter URL")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = blogImageSchema.safeParse({ file })
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Invalid image")
      e.target.value = ""
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    const result = await uploadBlogImageAction(formData)
    if (result.success) {
      editor.chain().focus().setImage({ src: result.url }).run()
    } else {
      toast.error(result.error)
    }

    e.target.value = ""
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!canUndo}
        className={buttonClass(false)}
        title="Undo"
      >
        <UndoIcon className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!canRedo}
        className={buttonClass(false)}
        title="Redo"
      >
        <RedoIcon className="size-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <HeadingSelector editor={editor} />

      <div className="w-px h-5 bg-border mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
        title="Bold"
      >
        <BoldIcon className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
        title="Italic"
      >
        <ItalicIcon className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive("strike"))}
        title="Strikethrough"
      >
        <StrikethroughIcon className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={buttonClass(editor.isActive("code"))}
        title="Inline code"
      >
        <CodeIcon className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={buttonClass(editor.isActive("superscript"))}
        title="Superscript"
      >
        <SuperscriptIcon className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={buttonClass(editor.isActive("subscript"))}
        title="Subscript"
      >
        <SubscriptIcon className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={buttonClass(editor.isActive("highlight"))}
        title="Highlight"
      >
        <HighlighterIcon className="size-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
        title="Bullet list"
      >
        <ListIcon className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
        title="Ordered list"
      >
        <ListOrderedIcon className="size-4" />
      </button>
      <AlignmentSelector editor={editor} />

      <div className="w-px h-5 bg-border mx-1" />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
        aria-label="Upload image"
      />
      <button
        onClick={() => imageInputRef.current?.click()}
        className={buttonClass(false)}
        title="Insert image"
      >
        <ImageIcon className="size-4" />
      </button>
      <button
        onClick={setLink}
        className={buttonClass(editor.isActive("link"))}
        title="Link"
      >
        <LinkIcon className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass(editor.isActive("blockquote"))}
        title="Blockquote"
      >
        <QuoteIcon className="size-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={buttonClass(false)}
        title="Divider"
      >
        <MinusIcon className="size-4" />
      </button>

      <span className="ml-auto text-xs text-muted-foreground px-2 py-1 rounded-full border-muted border-2 bg-muted-background">
        {words.toLocaleString()} {words === 1 ? "word" : "words"}
      </span>
    </div>
  )
}
