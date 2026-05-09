import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/about",
        "/pricing",
        "/features",
        "/contact",
        "/docs",
        "/terms",
        "/privacy",
        "/cookies",
        "/refund",
        "/disclaimer",
        "/grievance",
        "/support",
        "/credits",
        "/blog/",
      ],
      disallow: [
        "/dashboard/",
        "/profile/",
        "/settings/",
        "/security",
        "/preferences/",
        "/developer/",
        "/api/",
        "/monitoring/",
        "/admin/",
        "/blog/drafts/",
        "/blog/categories/",
        "/blog/edit/",
      ],
    },
    sitemap: `${siteConfig.brand.url}/sitemap.xml`,
  }
}
