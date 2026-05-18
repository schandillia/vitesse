import { DocsBody, DocsPage } from "fumadocs-ui/page"
import { notFound } from "next/navigation"
import { source } from "@/lib/source"
import { CopyMarkdownButton } from "@/app/docs/components/copy-markdown-button"
import { getDocMarkdown } from "@/lib/docs/get-doc-markdown"
import { DocsActions } from "@/app/docs/components/docs-actions"
import { Callout } from "fumadocs-ui/components/callout"
import { siteConfig } from "@/config/site"
import { buildBreadcrumbJsonLd } from "@/lib/build-breadcrumb-jsonld"
import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/build-page-metadata"

type PageProps = {
  params: Promise<{
    slug?: string[]
  }>
}

function normalizeDocSlug(slug: string[] | undefined): string[] | undefined {
  return slug?.[0] === "overview" && slug.length === 1 ? undefined : slug
}

function buildDocDescription(title: string, description?: string): string {
  return description ?? `${title} — ${siteConfig.brand.name} documentation`
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const normalizedSlug = normalizeDocSlug(slug)
  const page = source.getPage(normalizedSlug)
  if (!page) return {}

  const slugPath = normalizedSlug?.join("/") ?? ""
  const canonical = `${siteConfig.brand.url}/docs${slugPath ? `/${slugPath}` : ""}`
  const description = buildDocDescription(
    page.data.title,
    page.data.description
  )

  return buildPageMetadata({
    title: page.data.title,
    description,
    canonical,
    section: "Docs",
  })
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const normalizedSlug = normalizeDocSlug(slug)
  const markdown = await getDocMarkdown(normalizedSlug)
  const slugPath = normalizedSlug?.join("/") ?? "index"
  const { github, defaultBranch, docsPath } = siteConfig.brand.repository
  const githubUrl = `${github}/blob/${defaultBranch}/${docsPath}/${slugPath}.mdx`
  const markdownUrl = `/api/docs/raw/${slugPath}`
  const page = source.getPage(normalizedSlug)

  if (!page) {
    notFound()
  }

  const slugPathForBreadcrumb = normalizedSlug?.join("/") ?? ""
  const canonical = `${siteConfig.brand.url}/docs${slugPathForBreadcrumb ? `/${slugPathForBreadcrumb}` : ""}`

  const breadcrumbJsonLd = buildBreadcrumbJsonLd({
    items: [
      { name: "Home", url: siteConfig.brand.url },
      { name: "Docs", url: `${siteConfig.brand.url}/docs` },
      ...(normalizedSlug ? [{ name: page.data.title, url: canonical }] : []),
    ],
  })

  const MDX = page.data.body

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mb-6 flex items-center gap-3">
        <CopyMarkdownButton markdown={markdown} />
        <DocsActions githubUrl={githubUrl} markdownUrl={markdownUrl} />
      </div>
      <DocsBody>
        <MDX components={{ Callout }} />
      </DocsBody>
    </DocsPage>
  )
}
