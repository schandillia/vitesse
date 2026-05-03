import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { PersonalInfoCard } from "@/app/(protected)/profile/personal/components/personal-info-card"
import { OnlinePresenceCard } from "@/app/(protected)/profile/personal/components/online-presence-card"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.profile.personal.title,
  description: siteConfig.seo.metaData.profile.personal.description,
  robots: siteConfig.seo.metaData.profile.personal.robots,
}

export default async function ProfilePersonalPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Personal Information"
        description="Update additional personal information about your profile"
      />
      <PersonalInfoCard user={user} />
      <OnlinePresenceCard user={user} />
    </div>
  )
}
