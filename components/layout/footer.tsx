import Link from "next/link"
import { siteConfig } from "@/config/site"
import { ModeToggle } from "@/components/layout/mode-toggle"

function getCopyrightYears() {
  const currentYear = new Date().getFullYear()
  if (
    siteConfig.copyrightStartYear &&
    siteConfig.copyrightStartYear < currentYear
  ) {
    return `${siteConfig.copyrightStartYear}–${currentYear}`
  }
  return `${currentYear}`
}

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/cookies", label: "Cookies" },
  { href: "/terms", label: "Terms" },
  { href: "/support", label: "Support" },
]

export function Footer() {
  return (
    <footer className="border-t py-4">
      <div className="mx-auto max-w-6xl px-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between font-semibold">
        {/* Left: Links */}
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {footerLinks.map((link, i) => (
            <span key={link.href} className="flex items-center gap-4">
              <Link
                href={link.href}
                className="hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-2"
              >
                {link.label}
              </Link>

              {i < footerLinks.length - 1 && (
                <span className="text-muted-foreground/50">|</span>
              )}
            </span>
          ))}
        </nav>

        {/* Right: Copyright + Toggle */}
        <div className="flex items-center justify-center gap-3 md:justify-end">
          <p className="text-sm text-muted-foreground">
            © {getCopyrightYears()} {siteConfig.name}
          </p>
          <ModeToggle />
        </div>
      </div>
    </footer>
  )
}
