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
import { authClient, signIn } from "@/lib/auth-client"
import { useState, useRef } from "react"
import { FaGoogle, FaApple, FaFingerprint } from "react-icons/fa"
import { LoadingSwap } from "@/components/ui/loading-swap"
import SocialLoginButton from "@/components/auth/social-login-button"

interface LoginFormProps extends React.ComponentProps<"div"> {
  callbackURL?: string
}

export function LoginForm({
  className,
  callbackURL = "/dashboard",
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isLoadingRef = useRef(false)

  async function withLoading(fn: () => Promise<void>) {
    if (isLoadingRef.current) return
    isLoadingRef.current = true
    setIsLoading(true)
    setError(null)
    try {
      await fn()
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }

  function handleError(err?: { message?: string } | null) {
    setError(err?.message ?? "Something went wrong. Please try again.")
  }

  function handleSocialLogin(provider: "google" | "apple") {
    return () =>
      withLoading(async () => {
        const { error } = await authClient.signIn.social({
          provider,
          callbackURL,
        })
        if (error) handleError(error)
      })
  }

  function handlePasskey() {
    withLoading(async () => {
      const { error } = await signIn.passkey()
      if (error) handleError(error)
    })
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    await withLoading(async () => {
      const { error } = await signIn.magicLink({ email, callbackURL })
      if (error) handleError(error)
      else setSent(true)
    })
  }

  const socialProviders = [
    {
      icon: <FaApple className="size-6" />,
      label: "Continue with Apple",
      onClick: handleSocialLogin("google"), // temporary: replace with "apple" later
    },
    {
      icon: <FaGoogle className="size-5" />,
      label: "Continue with Google",
      onClick: handleSocialLogin("google"),
    },
    {
      icon: <FaFingerprint className="size-5" />,
      label: "Continue with Passkey",
      onClick: handlePasskey,
    },
  ]

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <span className="sr-only" aria-live="polite">
        {isLoading ? "Signing in, please wait." : ""}
      </span>
      {sent ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 md:p-8 text-center">
          <h2 className="text-2xl font-bold">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            We sent a login link to <strong>{email}</strong>. Click the link in
            the email to sign in.
          </p>
          <Button variant="link" onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </div>
      ) : (
        <form className="p-6 md:p-8" onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">
                Welcome to {siteConfig.name}
              </h1>
              <p className="text-sm text-balance text-muted-foreground">
                Enter your email below to receive a secure login link.
              </p>
            </div>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="example@vitesse.com"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
              />
            </Field>

            <Field>
              <Button type="submit" className="w-full" disabled={isLoading}>
                <LoadingSwap isLoading={isLoading}>Send Login Link</LoadingSwap>
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

            <Field className="grid grid-cols-3 gap-4">
              {socialProviders.map((provider) => (
                <SocialLoginButton
                  key={provider.label}
                  {...provider}
                  disabled={isLoading}
                />
              ))}
            </Field>
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
