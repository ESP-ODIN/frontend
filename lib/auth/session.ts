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

export type SessionAccount = { id: string; email: string | null }

/**
 * Compte connecté, lu dans le payload du JWT (claims `id` et `email`, les seuls que l'auth met).
 * Le token n'est pas vérifié ici : ça sert seulement à choisir quoi afficher, les routes protégées
 * du backend revalident la signature. `null` sans session ou si le token est illisible.
 */
export async function getSessionAccount(): Promise<SessionAccount | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const payload = token?.split(".")[1]
  if (!payload) return null

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { id?: unknown; email?: unknown }
    if (typeof claims.id !== "string") return null
    return { id: claims.id, email: typeof claims.email === "string" ? claims.email : null }
  } catch {
    return null
  }
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
