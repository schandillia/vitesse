import { siteConfig } from "@/config/site"
import { Metadata } from "next"
import { GatedPageTitle } from "@/components/layout/gated-page-title"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.admin.system.title,
  description: siteConfig.seo.metaData.admin.system.description,
  robots: siteConfig.seo.metaData.admin.system.robots,
}

export default function AdminSystemPage() {
  return (
    <div className="container">
      <GatedPageTitle
        title="System Info"
        description="View environment configurations and real-time infrastructure health checks"
      />
      {/* Health indicators and env variables will go here */}
    </div>
  )
}
