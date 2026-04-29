import { UserButton } from "@/components/auth/user-button"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import type { Session } from "@/lib/auth/auth"

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
]

interface NavbarProps {
  session: Session | null
}

export function Navbar({ session }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label={siteConfig.brand.name}
          className="flex items-center gap-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand-logo.svg"
            alt={siteConfig.brand.name}
            className="h-7 w-auto"
          />
          <span className="font-extrabold text-2xl tracking-tight">
            {siteConfig.brand.name}
          </span>
        </Link>
        <div className="flex items-center gap-6 font-bold">
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <UserButton session={session} />
        </div>
      </div>
    </header>
  )
}
