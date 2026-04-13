import { SidebarTrigger } from "@/components/ui/sidebar"
import { siteConfig } from "@/config/site"
import { MenuIcon } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteConfig.metaData.dashboard.title,
  description: siteConfig.metaData.dashboard.description,
}

export default function DashboardPage() {
  return (
    <div className="container">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden p-1 shrink-0">
          <MenuIcon className="size-5" />
        </SidebarTrigger>
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <p>Welcome to your dashboard!</p>
    </div>
  )
}
