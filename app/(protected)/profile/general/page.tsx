import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { BioCard } from "@/app/(protected)/profile/general/components/bio-card"
import { ProfileInformation } from "@/app/(protected)/profile/general/components/profile-information"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.profile.general.title,
  description: siteConfig.seo.metaData.profile.general.description,
  robots: siteConfig.seo.metaData.profile.general.robots,
}

export default async function ProfileGeneralPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Basic Profile"
        description="Update your basic personal information and bio"
      />
      <ProfileInformation user={user} />
      <BioCard initialBio={session.user.bio ?? null} />
    </div>
  )
}
