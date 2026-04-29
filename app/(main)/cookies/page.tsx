import { siteConfig } from "@/config/site"
import type { Metadata } from "next"
import { CookiePreferences } from "@/app/(main)/cookies/components/cookie-preferences"
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer"
import { getLegalContent } from "@/lib/legal-pages/get-legal-content"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.cookies.title,
  description: siteConfig.seo.metaData.cookies.description,
}

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
