import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth/auth"
import { CSP } from "@/lib/csp"
import { ROLES } from "@/lib/auth/roles"
import {
  publicRoutes,
  publicPrefixes,
  adminPrefixes,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  routeRedirects,
} from "@/routes"
import { siteConfig } from "@/config/site"

const createUrl = (path: string, url: URL) => new URL(path, url)

export async function proxy(request: NextRequest) {
  const { nextUrl } = request
  const { pathname, search } = nextUrl

  let response = NextResponse.next()

  const redirect = routeRedirects[pathname]
  if (redirect) {
    return NextResponse.redirect(createUrl(redirect, nextUrl))
  }

  const isPublicRoute =
    publicRoutes.has(pathname) ||
    publicPrefixes.some((prefix) => pathname.startsWith(prefix))
  const isAdminRoute = adminPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  )

  // 1. Routing & Auth Logic
  if (!isPublicRoute) {
    const session = await auth.api.getSession({
      headers: request.headers,
      ...(siteConfig.authAndSession.logOutEverywhereInstantly && {
        query: { disableCookieCache: true },
      }),
    })
    const isLoggedIn = !!session
    const userRole = session?.user?.role || ROLES.USER

    if (authRoutes.has(pathname)) {
      if (isLoggedIn) {
        const callbackUrl = nextUrl.searchParams.get("callbackUrl")

        const safeCallbackUrl =
          callbackUrl && callbackUrl.startsWith("/")
            ? callbackUrl
            : DEFAULT_LOGIN_REDIRECT

        response = NextResponse.redirect(createUrl(safeCallbackUrl, nextUrl))
      }
    } else if (!isLoggedIn) {
      const callbackUrl = `${pathname}${search}`
      const safeCallbackUrl = callbackUrl.startsWith("/")
        ? callbackUrl
        : DEFAULT_LOGIN_REDIRECT
      const encodedCallbackUrl = encodeURIComponent(safeCallbackUrl)

      response = NextResponse.redirect(
        createUrl(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
      )
    } else if (isAdminRoute && userRole !== ROLES.ADMIN) {
      // Gatekeeper: Logged in, but not an admin trying to access /admin
      // Redirect them to the default logged-in area to prevent access
      response = NextResponse.redirect(
        createUrl(DEFAULT_LOGIN_REDIRECT, nextUrl)
      )
    }
  }

  // 2. CSP Optimization (Only apply to actual page renders, skip redirects)
  if (response.status !== 301 && response.status !== 302) {
    response.headers.set("Content-Security-Policy", CSP)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|ingest|_next/static|_next/image|favicon.ico|assets/|fonts/|audio/effects/|.*\\.(?:svg|png|jpg|jpeg|webp|mp3|ico|json|txt|wav)$).*)",
  ],
}
