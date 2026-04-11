"use client"

import { UserButton } from "@/components/auth/user-button"
import Link from "next/link"
import { siteConfig } from "@/config/site"

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label={siteConfig.name}>
          <img
            src="/brand-logo.svg"
            alt={siteConfig.name}
            className="h-7 w-auto"
          />
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <UserButton />
        </div>
      </div>
    </header>
  )
}
