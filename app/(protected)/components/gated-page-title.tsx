import { SidebarTrigger } from "@/components/ui/sidebar"
import { MenuIcon } from "lucide-react"

interface GatedPageTitleProps {
  title: string
  description?: string
}

export function GatedPageTitle({ title, description }: GatedPageTitleProps) {
  return (
    <div className="flex flex-col gap-1 mb-5">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden p-1 shrink-0">
          <MenuIcon className="size-8" />
        </SidebarTrigger>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  )
}
