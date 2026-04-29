"use client"

import type { Editor } from "@tiptap/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  ChevronDownIcon,
} from "lucide-react"

interface AlignmentSelectorProps {
  editor: Editor | null
}

const alignments = [
  { label: "Left", value: "left", icon: AlignLeftIcon },
  { label: "Center", value: "center", icon: AlignCenterIcon },
  { label: "Right", value: "right", icon: AlignRightIcon },
  { label: "Justify", value: "justify", icon: AlignJustifyIcon },
]

export function AlignmentSelector({ editor }: AlignmentSelectorProps) {
  if (!editor) return null

  const active =
    alignments.find((a) => editor.isActive({ textAlign: a.value })) ??
    alignments[0]
  const ActiveIcon = active.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
        <ActiveIcon className="size-4" />
        <ChevronDownIcon className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {alignments.map(({ label, value, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => editor.chain().focus().setTextAlign(value).run()}
            className="flex items-center gap-2"
          >
            <Icon className="size-4" />
            {label}
            {editor.isActive({ textAlign: value }) && (
              <span className="ml-auto">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
