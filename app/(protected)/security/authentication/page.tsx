import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { PasskeyManagement } from "@/app/(protected)/security/authentication/components/passkey-management"
import { siteConfig } from "@/config/site"
import { auth } from "@/lib/auth/auth"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.security.authentication.title,
  description: siteConfig.seo.metaData.security.authentication.description,
  robots: siteConfig.seo.metaData.security.authentication.robots,
}

export default async function SecurityAuthenticationPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  const passkeys = await auth.api.listPasskeys({ headers: await headers() })

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="Authentication"
        description="Manage your passkeys and sign-in methods"
      />
      <PasskeyManagement passkeys={passkeys} />
    </div>
  )
}
