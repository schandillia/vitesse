import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { ProfessionalInfoCard } from "@/app/(protected)/profile/personal/components/professional-info-card"

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
      <ProfessionalInfoCard user={user} />
    </div>
  )
}
