"use client"

import { useAnalytics } from "@/app/hooks/use-analytics"
import { useEffect, useRef } from "react"

interface PostHogIdentifyProps {
  userId: string
  email?: string | null
  name?: string | null
}

export function PostHogIdentify({ userId, email, name }: PostHogIdentifyProps) {
  const { identify } = useAnalytics()
  const hasIdentified = useRef(false)

  useEffect(() => {
    if (!userId || hasIdentified.current) return
    identify(userId, { email, name })
    hasIdentified.current = true
  }, [userId, email, name, identify])

  return null
}
