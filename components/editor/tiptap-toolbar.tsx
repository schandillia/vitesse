"use client"

import { AlignmentSelector } from "@/components/editor/alignment-selector"
import { HeadingSelector } from "@/components/editor/heading-selector"
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
} from "lucide-react"

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
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return { canUndo: false, canRedo: false }
      return {
        canUndo: ctx.editor.can().undo(),
        canRedo: ctx.editor.can().redo(),
      }
    },
  })

  const canUndo = editorState?.canUndo ?? false
  const canRedo = editorState?.canRedo ?? false

  if (!editor) return null

  const setLink = () => {
    const url = window.prompt("Enter URL")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
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
    </div>
  )
}
