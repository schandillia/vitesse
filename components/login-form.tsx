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
import { GrApple } from "react-icons/gr"

export function AuthForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    await signIn.magicLink({
      email,
      callbackURL: "/dashboard",
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:block">
            <img
              src="/login-image.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full">
                  Send Login Link
                </Button>
              </Field>

              <div className="relative flex items-center gap-3 text-sm text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                <span>Or continue with</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Field className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button">
                  <FaApple className="size-6" />
                  <span className="sr-only">Continue with Apple</span>
                </Button>
                <Button variant="outline" type="button">
                  <FaGoogle className="size-5" />
                  <span className="sr-only">Continue with Google</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => signIn.passkey()}
                >
                  <FaFingerprint className="size-5" />
                  <span className="sr-only">Continue with Passkey</span>
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="/terms">Terms of Service</a> and{" "}
        <a href="/privacy">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
