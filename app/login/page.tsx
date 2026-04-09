import { AuthForm } from "@/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account.",
}

export default function AuthPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <AuthForm />
      </div>
    </div>
  )
}
