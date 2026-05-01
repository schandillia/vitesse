import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface BlogBreadcrumbsProps {
  className?: string
  postTitle?: string
  categoryName?: string
  authorName?: string
}

function TrailingCrumb({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className={className}>{label}</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  )
}

export function BlogBreadcrumbs({
  className,
  postTitle,
  categoryName,
  authorName,
}: BlogBreadcrumbsProps) {
  const trailing = postTitle
    ? { label: postTitle, className: "max-w-[200px] md:max-w-[400px] truncate" }
    : categoryName
      ? { label: categoryName }
      : authorName
        ? { label: authorName }
        : null

  return (
    <Breadcrumb aria-label="Breadcrumb" className={cn("mb-10", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/blog">Blog</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {trailing && <TrailingCrumb {...trailing} />}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
