import { siteConfig } from "@/config/site"
import { Metadata } from "next"
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer"
import { getLegalContent } from "@/lib/legal-pages/get-legal-content"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.grievance.title,
  description: siteConfig.seo.metaData.grievance.description,
}

export default async function GrievancePage() {
  const content = await getLegalContent("grievance")

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <MarkdownRenderer source={content} />
      </article>
    </div>
  )
}
