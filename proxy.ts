import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth/auth"
import {
  publicRoutes,
  authRoutes,
  apiRoutes,
  DEFAULT_LOGIN_REDIRECT,
} from "@/routes"

const createUrl = (path: string, url: URL) => new URL(path, url)

export async function proxy(request: NextRequest) {
  const { nextUrl } = request
  const { pathname, search } = nextUrl

  if (pathname.startsWith(apiRoutes)) {
    return NextResponse.next()
  }

  if (publicRoutes.has(pathname)) {
    return NextResponse.next()
  }

  const session = await auth.api.getSession({ headers: request.headers })
  const isLoggedIn = !!session

  if (authRoutes.has(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(createUrl(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return NextResponse.next()
  }

  // Redirect unauthenticated users safely
  if (!isLoggedIn) {
    const callbackUrl = `${pathname}${search}`

    const safeCallbackUrl = callbackUrl.startsWith("/")
      ? callbackUrl
      : DEFAULT_LOGIN_REDIRECT

    const encodedCallbackUrl = encodeURIComponent(safeCallbackUrl)

    return NextResponse.redirect(
      createUrl(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets/|fonts/|audio/effects/|.*\\.(?:svg|png|jpg|jpeg|webp|mp3|ico|json|txt|wav)$).*)",
  ],
}
