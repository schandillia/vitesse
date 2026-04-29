import { Image } from "@tiptap/extension-image"
import { ReactNodeViewRenderer } from "@tiptap/react"
import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import { ImageNodeView } from "@/app/(main)/blog/components/image-node-view"

interface MarkdownSerializerState {
  write: (string: string) => void
}

export const CustomImage = Image.configure({ inline: false }).extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: "",
        parseHTML: (element) =>
          element.getAttribute("alt") ||
          element.querySelector("figcaption")?.textContent ||
          "",
        renderHTML: (attributes) => ({
          alt: attributes.caption,
        }),
      },
    }
  },

  addStorage() {
    return {
      markdown: {
        serialize: (state: MarkdownSerializerState, node: ProseMirrorNode) => {
          const caption = node.attrs.caption || ""
          const src = node.attrs.src
          state.write(`![${caption}](${src})`)
        },
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  },
})
