import React from "react"
import { MDXRemote } from "next-mdx-remote/rsc"
import { siteConfig } from "@/config/site"
import remarkGfm from "remark-gfm"
import remarkSupersub from "remark-supersub"

// 1. Define your custom components locally
const mdxComponents = {
  Callout: ({ children }: { children: React.ReactNode }) => (
    <div className="p-4 bg-primary/5 border-l-4 border-primary my-6 rounded-r-md italic">
      {children}
    </div>
  ),
  Signature: () => (
    <div className="mt-12 pt-8 border-t border-muted italic text-sm text-muted-foreground">
      Written by the {siteConfig.brand.name} Editorial Team.
    </div>
  ),
}

// 2. Define your props
interface MarkdownRendererProps {
  source: string
}

// 3. Export the unified renderer
export function MarkdownRenderer({ source }: MarkdownRendererProps) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [
            [remarkGfm, { singleTilde: false }], // Handles Tables, Strikethrough, Autolinks
            remarkSupersub, // Handles BOTH ^superscript^ and ~subscript~
          ],
        },
      }}
    />
  )
}
