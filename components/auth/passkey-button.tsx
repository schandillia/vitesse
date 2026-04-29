"use client"

import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FaFingerprint } from "react-icons/fa"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { siteConfig } from "@/config/site"

interface PasskeyButtonProps {
  callbackURL?: string
  onSuccess?: () => void
  disabled?: boolean
  onLoadingChange?: (loading: boolean) => void
}

export function PasskeyButton({
  callbackURL,
  onSuccess,
  disabled,
  onLoadingChange,
}: PasskeyButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  function setLoading(loading: boolean) {
    setIsLoading(loading)
    onLoadingChange?.(loading)
  }

  function handleSuccess() {
    setLoading(false)

    if (onSuccess) {
      onSuccess()
    } else {
      router.push(callbackURL ?? siteConfig.authAndSession.callbackAfterLogin)
    }
  }

  async function handleClick() {
    if (isLoading) return

    setLoading(true)

    try {
      await authClient.signIn.passkey(undefined, {
        onSuccess: handleSuccess,
        onError: () => setLoading(false),
      })
    } catch {
      // Safety fallback in case the client throws instead of using onError
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      type="button"
      disabled={disabled || isLoading}
      onClick={handleClick}
    >
      <LoadingSwap isLoading={isLoading}>
        <FaFingerprint className="size-6" />
      </LoadingSwap>
    </Button>
  )
}
