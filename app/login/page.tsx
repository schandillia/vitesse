import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent } from "@/components/ui/card"
import { siteConfig } from "@/config/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.login.title,
  description: siteConfig.seo.metaData.login.description,
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const params = await searchParams
  const rawCallbackUrl = params?.callbackUrl

  const callbackURL =
    rawCallbackUrl && rawCallbackUrl.startsWith("/")
      ? rawCallbackUrl
      : siteConfig.authAndSession.callbackAfterLogin

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* image column — hidden on mobile, visible on md+ */}
            <div className="relative hidden min-h-[350px] bg-muted md:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/login-image.svg"
                alt={`Illustration for ${siteConfig.brand.name} login`}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 dark:bg-black/60" />
            </div>
            <LoginForm callbackURL={callbackURL} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
