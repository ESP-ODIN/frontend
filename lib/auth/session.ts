import { cookies } from "next/headers"

import { SESSION_COOKIE } from "@/lib/auth/constants"

export async function setSession(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  })
}

/**
 * Vérification optimiste (présence du cookie seulement) : suffit pour adapter l'UI, la vraie
 * validation du JWT se fait côté backend.
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.has(SESSION_COOKIE)
}
