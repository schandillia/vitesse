"use client"

import type { Editor } from "@tiptap/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"

interface HeadingSelectorProps {
  editor: Editor | null
}

const styles = [
  {
    label: "Normal text",
    action: (editor: Editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    label: "Heading 1",
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    label: "Heading 2",
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: "Heading 3",
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    label: "Heading 4",
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 4 }).run(),
  },
]

export function HeadingSelector({ editor }: HeadingSelectorProps) {
  if (!editor) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-sm px-2 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
        Style <ChevronDownIcon className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {styles.map((style) => (
          <DropdownMenuItem
            key={style.label}
            onClick={() => style.action(editor)}
          >
            {style.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
