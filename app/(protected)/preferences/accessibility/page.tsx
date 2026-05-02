import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { FontSizeSelector } from "@/app/(protected)/preferences/accessibility/components/font-size-selector"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { db } from "@/db/drizzle"
import { user as userTable } from "@/db/auth-schema"
import { eq } from "drizzle-orm"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.preferences.accessibility.title,
  description: siteConfig.seo.metaData.preferences.accessibility.description,
  robots: siteConfig.seo.metaData.preferences.accessibility.robots,
}

export default async function PreferencesAccessibilityPage() {
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

  const preferredFontSize = userData[0]?.preferredFontSize ?? "16"

  return (
    <div className="container space-y-5">
      <GatedPageTitle
        title="Accessibility Preferences"
        description="Adjust font size and motion settings to suit your needs"
      />
      <FontSizeSelector initialSize={preferredFontSize} />
    </div>
  )
}
