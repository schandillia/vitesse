"use client"

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react"
import { XIcon } from "lucide-react"

export function ImageNodeView({ node, deleteNode }: NodeViewProps) {
  return (
    <NodeViewWrapper as="div" className="my-4">
      <div className="relative block w-fit group">
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          className="max-w-full rounded-lg block"
        />
        <button
          onClick={deleteNode}
          className="absolute top-2 right-2 p-1 rounded-full bg-background/80 backdrop-blur text-destructive opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-background cursor-pointer"
          title="Remove image"
        >
          <XIcon className="size-4" />
        </button>
      </div>
    </NodeViewWrapper>
  )
}
