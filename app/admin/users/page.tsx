import { siteConfig } from "@/config/site"
import { Metadata } from "next"
import { GatedPageTitle } from "@/components/layout/gated-page-title"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.admin.users.title,
  description: siteConfig.seo.metaData.admin.users.description,
  robots: siteConfig.seo.metaData.admin.users.robots,
}

export default function AdminUsersPage() {
  return (
    <div className="container">
      <GatedPageTitle
        title="Manage Users"
        description="View and manage platform users, assign roles, and control account access"
      />
    </div>
  )
}
