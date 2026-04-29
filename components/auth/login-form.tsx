"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { siteConfig } from "@/config/site"
import { authClient, signIn } from "@/lib/auth/auth-client"
import { useState, useRef } from "react"
import { FaGoogle, FaApple } from "react-icons/fa"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { MagicLinkSent } from "@/components/auth/magic-link-sent"
import { LoginFormHeader } from "@/components/auth/login-form-header"
import { SocialLogin } from "@/components/auth/social-login"

interface LoginFormProps extends React.ComponentProps<"div"> {
  callbackURL?: string
  onSuccess?: () => void
}

export function LoginForm({
  className,
  callbackURL = siteConfig.authAndSession.callbackAfterLogin,
  onSuccess,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loadingAction, setLoadingAction] = useState<"magic" | "other" | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)
  const isLoadingRef = useRef(false)

  async function withLoading(
    action: "magic" | "other",
    fn: () => Promise<void>
  ) {
    if (isLoadingRef.current) return
    isLoadingRef.current = true
    setLoadingAction(action)
    setError(null)
    try {
      await fn()
    } finally {
      isLoadingRef.current = false
      setLoadingAction(null)
    }
  }

  function handleError(err?: { message?: string } | null) {
    setError(err?.message ?? "Something went wrong. Please try again.")
  }

  function handleOneClickLogin(provider: "google" | "apple") {
    return () =>
      withLoading("other", async () => {
        const { error } = await authClient.signIn.social({
          provider,
          callbackURL,
        })
        if (error) handleError(error)
      })
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    await withLoading("magic", async () => {
      const { error } = await signIn.magicLink({ email, callbackURL })
      if (error) handleError(error)
      else setSent(true)
    })
  }

  const socialProviders = [
    {
      icon: <FaApple className="size-6" />,
      label: "Continue with Apple",
      onClick: handleOneClickLogin("apple"),
    },
    {
      icon: <FaGoogle className="size-5" />,
      label: "Continue with Google",
      onClick: handleOneClickLogin("google"),
    },
  ]

  const isDisabled = loadingAction !== null

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <span className="sr-only" aria-live="polite">
        {loadingAction ? "Signing in, please wait." : ""}
      </span>

      {sent ? (
        <MagicLinkSent email={email} onReset={() => setSent(false)} />
      ) : (
        <form className="p-6 md:p-8" onSubmit={handleSubmit}>
          <FieldGroup>
            <LoginFormHeader />
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="albert@einstein.com"
                required
                disabled={isDisabled}
                value={email}
                autoComplete="email"
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
              />
            </Field>

            <Field>
              <Button type="submit" className="w-full" disabled={isDisabled}>
                <LoadingSwap isLoading={loadingAction === "magic"}>
                  Send Login Link
                </LoadingSwap>
              </Button>
              {error && (
                <p className="text-sm text-destructive" aria-live="polite">
                  {error}
                </p>
              )}
            </Field>

            <div className="relative flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>Or continue with</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <SocialLogin
              providers={socialProviders}
              disabled={isDisabled}
              onSuccess={onSuccess}
              onLoadingChange={(loading) =>
                setLoadingAction(loading ? "other" : null)
              }
              callbackURL={callbackURL}
            />
          </FieldGroup>
        </form>
      )}

      {!sent && (
        <FieldDescription className="px-6 pb-6 text-sm text-center">
          By clicking continue, you agree to our{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </FieldDescription>
      )}
    </div>
  )
}
