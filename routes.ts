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
  "/contact",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
  ...(siteConfig.monitoring.sentry.enabled ? ["/monitoring"] : []),
])

/**
 * Prefixes for public routes with subroutes
 */
export const publicPrefixes = ["/blog/", "/docs/"]

/**
 * Prefixes for routes that require admin privileges
 */
export const adminPrefixes = ["/admin"]

/**
 * Maps root routes to their default subroutes.
 * Visiting a root route redirects to its first subroute instead of rendering a blank page.
 */
export const routeRedirects: Record<string, string> = {
  "/admin": "/admin/overview",
  "/profile": "/profile/general",
  "/dashboard": "/dashboard/general",
  "/security": "/security/general",
  "/settings": "/settings/general",
}

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
