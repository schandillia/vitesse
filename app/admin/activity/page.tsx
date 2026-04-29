import { siteConfig } from "@/config/site"
import { Metadata } from "next"
import { GatedPageTitle } from "@/components/layout/gated-page-title"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.admin.activity.title,
  description: siteConfig.seo.metaData.admin.activity.description,
  robots: siteConfig.seo.metaData.admin.activity.robots,
}

export default function AdminActivityPage() {
  return (
    <div className="container">
      <GatedPageTitle
        title="Recent Activity"
        description="Monitor platform events, recent signups, and user login history"
      />
      {/* Activity log tables or lists will go here */}
    </div>
  )
}
