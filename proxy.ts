import { NextResponse, type NextRequest } from "next/server"

import { SESSION_COOKIE } from "@/lib/auth/constants"
import { safeRedirectPath } from "@/lib/auth/redirect"

const PROTECTED_ROUTES = ["/publish", "/profile"]
const AUTH_ROUTES = ["/login", "/register"]

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const isLoggedIn = request.cookies.has(SESSION_COOKIE)

  if (!isLoggedIn && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }
  if (isLoggedIn && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(safeRedirectPath(searchParams.get("next")), request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/publish/:path*", "/profile/:path*", "/login", "/register"],
}
