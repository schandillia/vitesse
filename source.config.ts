import { pageSchema } from "fumadocs-core/source/schema"
import { defineDocs, defineConfig } from "fumadocs-mdx/config"
import { z } from "zod"

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      description: z.string().optional(),
    }),
  },
})

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
})
