import { GatedPageTitle } from "@/components/layout/gated-page-title"
import { BioCard } from "@/app/(protected)/profile/components/bio-card"
import { ProfileInformation } from "@/app/(protected)/profile/components/profile-information"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.profile.title,
  description: siteConfig.seo.metaData.profile.description,
  robots: siteConfig.seo.metaData.profile.robots,
}

export default async function ProfileGeneralPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  return (
    <div className="container space-y-5">
      <GatedPageTitle
        title="Profile"
        description="Update your personal information and public profile"
      />
      <ProfileInformation user={user} />
      <BioCard initialBio={session.user.bio ?? null} />
    </div>
  )
}
