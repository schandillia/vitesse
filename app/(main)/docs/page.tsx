import { siteConfig } from "@/config/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.docs.title,
  description: siteConfig.seo.metaData.docs.description,
}

export default function DocsPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Docs</h1>
      <p className="text-lg text-muted-foreground">
        Our documentation is comprehensive and easy to follow. Get started with
        our guides and tutorials.
      </p>
      {/* Add your documentation details here */}
    </div>
  )
}
