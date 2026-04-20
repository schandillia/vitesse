import { siteConfig } from "@/config/site"
import type { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import { readFile } from "fs/promises"
import path from "path"
import { CookiePreferences } from "@/app/(main)/cookies/components/cookie-preferences"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.cookies.title,
  description: siteConfig.seo.metaData.cookies.description,
}

export default async function CookiesPage() {
  const filePath = path.join(process.cwd(), "content", "cookies.md")
  const raw = await readFile(filePath, "utf-8")

  const content = raw
    .replace(/{{BRAND_NAME}}/g, siteConfig.brand.name)
    .replace(/{{LAST_REVISED_DATE}}/g, "April 19, 2026")
    .replace(/{{PRIVACY_EMAIL}}/g, siteConfig.emails.privacy.toEmail)

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>

      <CookiePreferences />
    </div>
  )
}
