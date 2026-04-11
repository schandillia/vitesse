"use client"

import { useLoginModal } from "@/components/auth/login-modal-provider"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import Link from "next/link"

export function Navbar() {
  const { openModal } = useLoginModal()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <Button onClick={openModal}>Log in</Button>
      </div>
    </header>
  )
}
