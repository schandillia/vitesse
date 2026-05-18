import { siteConfig } from "@/config/site"
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer"
import { getLegalContent } from "@/lib/legal-pages/get-legal-content"
import { buildPageMetadata } from "@/lib/seo/metadata/build-page-metadata"

export const metadata = buildPageMetadata({
  title: siteConfig.seo.metaData.grievance.title,
  description: siteConfig.seo.metaData.grievance.description,
  canonical: `${siteConfig.brand.url}/grievance`,
})

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
