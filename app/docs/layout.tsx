import type { ReactNode } from "react"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { siteConfig } from "@/config/site"
import { source } from "@/lib/source"
import { ModeToggle } from "@/components/layout/mode-toggle"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: `%s | Docs | ${siteConfig.brand.name}`,
    default: "Docs",
  },
}
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="fd-wrapper">
      <DocsLayout
        tree={source.pageTree}
        nav={{
          title: (
            <div
              className="flex items-center gap-2 mb-5 text-foreground"
              key="nav-title"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand-logo.svg"
                alt={siteConfig.brand.name}
                className="size-6 shrink-0"
              />
              <span className="font-extrabold text-2xl tracking-tight">
                {siteConfig.brand.name}
              </span>
            </div>
          ),
        }}
        sidebar={{
          defaultOpenLevel: 1,
          tabs: false,
          footer: (
            <div
              className="flex w-full justify-center pb-2"
              key="sidebar-footer"
            >
              <ModeToggle expanded={true} />
            </div>
          ),
        }}
      >
        {children}
      </DocsLayout>
    </div>
  )
}
