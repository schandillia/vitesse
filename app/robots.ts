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
        "/security",
      ],
      disallow: [
        "/dashboard/",
        "/profile/",
        "/settings/",
        "/api/",
        "/monitoring/",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
