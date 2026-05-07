import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { WorkInfoCard } from "@/app/(protected)/profile/professional/components/work-info-card"
import { OnlinePresenceCard } from "@/app/(protected)/profile/professional/components/online-presence-card"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.profile.professional.title,
  description: siteConfig.seo.metaData.profile.professional.description,
  robots: siteConfig.seo.metaData.profile.professional.robots,
}

export default async function ProfileProfessionalPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Professional Information"
        description="Update additional personal information about your profile"
      />
      <WorkInfoCard user={user} />
      <OnlinePresenceCard user={user} />
    </div>
  )
}
