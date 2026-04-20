import { ProtectedPageTitle } from "@/app/(protected)/components/protected-page-title"
import { ProfileInformation } from "@/app/(protected)/profile/components/profile-information"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.profile.title,
  description: siteConfig.seo.metaData.profile.description,
}

export default async function ProfilePage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  return (
    <div className="container">
      <ProtectedPageTitle title="Profile" />
      <ProfileInformation user={user} />
    </div>
  )
}
