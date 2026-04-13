import { SidebarTrigger } from "@/components/ui/sidebar"
import { MenuIcon } from "lucide-react"

interface ProtectedPageTitleProps {
  title: string
}

export function ProtectedPageTitle({ title }: ProtectedPageTitleProps) {
  return (
    <div className="flex items-center gap-3">
      <SidebarTrigger className="md:hidden p-1 shrink-0">
        <MenuIcon className="size-5" />
      </SidebarTrigger>
      <h1 className="text-3xl font-bold mb-10">{title}</h1>
    </div>
  )
}
