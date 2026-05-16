import { DocsSidebar } from "@/app/(main)/docs/components/docs-sidebar"
import type { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-4 md:-mx-8">
      <div className="mx-auto flex w-full max-w-7xl gap-12 px-6 py-10">
        <DocsSidebar />

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
