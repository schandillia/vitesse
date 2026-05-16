import Link from "next/link"

import { source } from "@/lib/source"

export function DocsSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <nav className="sticky top-24 space-y-2">
        {source.pageTree.children.map((item) => {
          if (!("url" in item) || !item.url) {
            return null
          }

          return (
            <Link
              key={item.url}
              href={item.url}
              className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
