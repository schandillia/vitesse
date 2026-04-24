import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

interface BlogBreadcrumbsProps {
  className?: string
  postTitle?: string
  categoryName?: string
}

export function BlogBreadcrumbs({
  className,
  postTitle,
  categoryName,
}: BlogBreadcrumbsProps) {
  return (
    <Breadcrumb aria-label="Breadcrumb" className={cn("mb-10", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
        </BreadcrumbItem>

        {/* Renders ONLY if you pass a postTitle */}
        {postTitle && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] md:max-w-[400px] truncate">
                {postTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}

        {/* Renders ONLY if you pass a categoryName (and no postTitle) */}
        {categoryName && !postTitle && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{categoryName}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
