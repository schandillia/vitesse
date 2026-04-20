import { ProtectedPageTitle } from "@/app/(protected)/components/protected-page-title"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.dashboard.title,
  description: siteConfig.seo.metaData.dashboard.description,
}

export default async function DashboardPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  return (
    <div className="container">
      <ProtectedPageTitle title="Dashboard" />
    </div>
  )
}
