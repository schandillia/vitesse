import { Image } from "@tiptap/extension-image"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { ImageNodeView } from "@/components/editor/image-node-view"

export const CustomImage = Image.configure({ inline: false }).extend({
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
