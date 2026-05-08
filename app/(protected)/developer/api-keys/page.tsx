import { GatedPageTitle } from "@/app/(protected)/components/gated-page-title"
import { siteConfig } from "@/config/site"
import { getServerSession } from "@/lib/auth/get-server-session"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { fetchApiKeys } from "@/actions/fetch-api-keys"
import { ApiKeysCard } from "@/app/(protected)/developer/api-keys/components/api-keys-card"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.developer.apiKeys.title,
  description: siteConfig.seo.metaData.developer.apiKeys.description,
  robots: siteConfig.seo.metaData.developer.apiKeys.robots,
}

export default async function DeveloperApiKeysPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!session || !user) {
    redirect("/login")
  }

  const result = await fetchApiKeys()
  const apiKeys = result.success ? result.data : []

  return (
    <div className="container space-y-8">
      <GatedPageTitle
        title="API Keys"
        description="Generate and manage your API keys and monitor usage"
      />
      <ApiKeysCard apiKeys={apiKeys} />
    </div>
  )
}
