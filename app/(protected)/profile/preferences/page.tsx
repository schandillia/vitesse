import { GatedPageTitle } from "@/components/layout/gated-page-title"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { MODES, type Mode } from "@/lib/auth/modes"
import { PreferencesModeToggle } from "@/app/(protected)/profile/preferences/components/preferences-mode-toggle"
import { db } from "@/db/drizzle"
import { user as userTable } from "@/db/auth-schema"
import { eq } from "drizzle-orm"
import { FontSizeSelector } from "@/app/(protected)/profile/preferences/components/font-size-selector"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.profile.title,
  description: siteConfig.seo.metaData.profile.description,
  robots: siteConfig.seo.metaData.profile.robots,
}

export default async function ProfilePreferencesPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  const userData = await db
    .select({
      preferredMode: userTable.preferredMode,
      preferredFontSize: userTable.preferredFontSize,
    })
    .from(userTable)
    .where(eq(userTable.id, user.id))
    .limit(1)

  const preferredMode = (userData[0]?.preferredMode ?? MODES.SYSTEM) as Mode
  const preferredFontSize = userData[0]?.preferredFontSize ?? "16"

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Preferences"
        description="Customize your experience"
      />
      <PreferencesModeToggle initialMode={preferredMode} />{" "}
      <FontSizeSelector initialSize={preferredFontSize} />
    </div>
  )
}
