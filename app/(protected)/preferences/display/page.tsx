import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { MODES, type Mode } from "@/db/types/modes"
import { PreferencesModeToggle } from "@/app/(protected)/preferences/display/components/preferences-mode-toggle"
import { db } from "@/db/drizzle"
import { user as userTable } from "@/db/auth-schema"
import { eq } from "drizzle-orm"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.preferences.display.title,
  description: siteConfig.seo.metaData.preferences.display.description,
  robots: siteConfig.seo.metaData.preferences.display.robots,
}

export default async function PreferencesDisplayPage() {
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

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Display Preferences"
        description="Customize your display mode and visual experience"
      />
      <PreferencesModeToggle initialMode={preferredMode} />
    </div>
  )
}
