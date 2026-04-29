import React, { ComponentPropsWithoutRef } from "react"
import { MDXRemote } from "next-mdx-remote/rsc"
import { siteConfig } from "@/config/site"
import remarkGfm from "remark-gfm"
import remarkSupersub from "remark-supersub"
import remarkAbbr from "@syenchuk/remark-abbr"

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
  abbr: (props: ComponentPropsWithoutRef<"abbr">) => (
    <abbr
      {...props}
      className="underline decoration-dotted cursor-help decoration-muted-foreground/50 underline-offset-4"
    />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      {...props}
      className="text-muted-foreground no-underline hover:underline [font-weight:inherit]"
    />
  ),

  img: ({ alt, ...props }: ComponentPropsWithoutRef<"img">) => {
    const caption = alt || ""

    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={caption}
          {...props}
          className="rounded-lg max-w-full mx-auto my-6 mb-2"
        />
        {caption && (
          <span className="block text-sm text-center text-muted-foreground mb-6">
            {caption}
          </span>
        )}
      </>
    )
  },
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
            remarkAbbr,
          ],
        },
      }}
    />
  )
}
