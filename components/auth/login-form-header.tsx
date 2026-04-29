import { siteConfig } from "@/config/site"

export function LoginFormHeader() {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h1 className="text-2xl font-bold">Welcome to {siteConfig.brand.name}</h1>
      <p className="text-sm text-balance text-muted-foreground">
        Enter your email below to receive a secure login link.
      </p>
    </div>
  )
}
