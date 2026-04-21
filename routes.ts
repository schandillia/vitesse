import { siteConfig } from "@/config/site"

/**
 * Sets of routes for different access levels
 * Using Sets for O(1) lookup performance
 */
export const publicRoutes = new Set([
  "/",
  "/terms",
  "/privacy",
  "/cookies",
  "/refund",
  "/disclaimer",
  "/about",
  "/pricing",
  "/docs",
  "/features",
  "/blog",
  "/faq",
  "/grievance",
  "/support",
  "/credits",
  "/security",
  "/contact",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
  ...(siteConfig.observability.sentry.enabled ? ["/monitoring"] : []),
])

export const authRoutes = new Set(["/login"])

/**
 * The prefix for API authentication routes
 * These routes will never be blocked
 */
export const apiRoutes = "/api/"

/**
 * The default redirect path after sign-in
 */
export const DEFAULT_LOGIN_REDIRECT =
  siteConfig.authAndSession.callbackAfterLogin
