import { siteConfig } from "@/config/site"
import { CookiePreferences } from "@/app/(main)/cookies/components/cookie-preferences"
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer"
import { getLegalContent } from "@/lib/legal-pages/get-legal-content"
import { buildPageMetadata } from "@/lib/seo/metadata/build-page-metadata"

export const metadata = buildPageMetadata({
  title: siteConfig.seo.metaData.cookies.title,
  description: siteConfig.seo.metaData.cookies.description,
  canonical: `${siteConfig.brand.url}/cookies`,
})

export default async function CookiesPage() {
  const content = await getLegalContent("cookies")

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <MarkdownRenderer source={content} />
      </article>

      <CookiePreferences />
    </div>
  )
}
