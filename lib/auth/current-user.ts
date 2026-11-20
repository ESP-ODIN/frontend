import { cache } from "react"
import { cookies } from "next/headers"

import { SESSION_COOKIE } from "@/lib/auth/constants"
import { getSessionAccount } from "@/lib/auth/session"
import { accountDisplay, type AccountDisplay, type CurrentUser } from "@/lib/api/profile"

const AUTH_API_URL = process.env.AUTH_API_URL

type ApiMe = {
  id: string
  email: string
  username?: string
  first_name?: string
  last_name?: string
  bio?: string | null
  created_at?: string
}

/**
 * Compte connecté. Essaie GET {AUTH_API_URL}/me avec le token de session ; tant que la route
 * n'existe pas (ou si elle échoue), retombe sur le JWT, qui ne contient que l'id et l'email.
 * `source` dit d'où viennent les données, pour afficher une DevMark quand c'est le JWT.
 * cache() : un seul appel par rendu, même si la nav et la page le demandent toutes les deux.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const account = await getSessionAccount()
  if (!account) return null

  const token = (await cookies()).get(SESSION_COOKIE)?.value
  try {
    const res = await fetch(`${AUTH_API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (res.ok) {
      const { data } = (await res.json()) as { data: ApiMe }
      return {
        id: data.id,
        email: data.email,
        username: data.username || undefined,
        firstName: data.first_name || undefined,
        lastName: data.last_name || undefined,
        bio: data.bio || undefined,
        createdAt: data.created_at,
        source: "api",
      }
    }
  } catch {}

  return { id: account.id, email: account.email ?? undefined, source: "jwt" }
})

/** Ce que la nav affiche du compte connecté, ou null sans session. */
export async function getAccountDisplay(): Promise<AccountDisplay | null> {
  const user = await getCurrentUser()
  return user ? accountDisplay(user) : null
}
