import { siteConfig } from "@/config/site"
import { Metadata } from "next"
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer"
import { getLegalContent } from "@/lib/legal-pages/get-legal-content"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.terms.title,
  description: siteConfig.seo.metaData.terms.description,
}

export default async function TermsPage() {
  const content = await getLegalContent("terms")

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <MarkdownRenderer source={content} />
      </article>
    </div>
  )
}
