"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { siteConfig } from "@/config/site"
import { signIn } from "@/lib/auth-client"
import { useState } from "react"

import { FaGoogle, FaApple, FaFingerprint } from "react-icons/fa"
import { LoadingSwap } from "@/components/ui/loading-swap"
import SocialLoginButton from "@/components/auth/social-login-button"

const socialProviders = [
  { icon: <FaApple className="size-6" />, label: "Continue with Apple" },
  { icon: <FaGoogle className="size-5" />, label: "Continue with Google" },
  {
    icon: <FaFingerprint className="size-5" />,
    label: "Continue with Passkey",
    onClick: () => signIn.passkey(),
  },
]

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const { error } = await signIn.magicLink({
      email,
      callbackURL: "/dashboard",
    })
    setIsLoading(false)
    if (error) {
      if (error.status === 429) {
        setError("Too many attempts. Please try after some time.")
      } else {
        setError("Something went wrong. Please check your email and try again.")
      }
    } else {
      setSent(true)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden min-h-[350px] bg-muted md:block">
            <img
              src="/login-image.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          {sent ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 md:p-8 text-center">
              <h2 className="text-2xl font-bold">Check your email</h2>
              <p className="text-sm text-muted-foreground">
                We sent a login link to <strong>{email}</strong>. Click the link
                in the email to sign in.
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError(null)
                    }}
                  />
                </Field>

                <Field>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <LoadingSwap isLoading={isLoading}>
                      Send Login Link
                    </LoadingSwap>
                  </Button>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </Field>

                <div className="relative flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="h-px flex-1 bg-border" />
                  <span>Or continue with</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <Field className="grid grid-cols-3 gap-4">
                  {socialProviders.map((provider) => (
                    <SocialLoginButton key={provider.label} {...provider} />
                  ))}
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
      {!sent && (
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </FieldDescription>
      )}
    </div>
  )
}
