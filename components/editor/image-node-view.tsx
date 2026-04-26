"use client"

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react"
import { XIcon } from "lucide-react"

export function ImageNodeView({
  node,
  deleteNode,
  updateAttributes,
}: NodeViewProps) {
  return (
    <NodeViewWrapper as="figure" className="my-4">
      <div className="relative block w-fit group">
        {/* eslint-disable-next-line @next/next/no-img-element -- TipTap NodeView requires raw <img> */}
        <img
          src={node.attrs.src}
          alt={node.attrs.caption || ""}
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
      <figcaption>
        <input
          type="text"
          value={node.attrs.caption || ""}
          onChange={(e) => updateAttributes({ caption: e.target.value })}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder="Add a caption…"
          className="w-full text-sm text-muted-foreground text-center bg-transparent outline-none placeholder:text-muted-foreground/40"
        />
      </figcaption>
    </NodeViewWrapper>
  )
}
