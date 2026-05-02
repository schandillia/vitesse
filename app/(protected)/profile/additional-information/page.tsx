import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.profile.additionalInformation.title,
  description:
    siteConfig.seo.metaData.profile.additionalInformation.description,
  robots: siteConfig.seo.metaData.profile.additionalInformation.robots,
}

export default async function ProfileAdditionalInformationPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Additional Information"
        description="Update additional information about your profile"
      />
    </div>
  )
}
