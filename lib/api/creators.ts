import { cache } from "react"

const MARKETPLACE_API_URL = process.env.MARKETPLACE_API_URL

/** Profil public d'un créateur, tel que GET /catalog/creators/:id doit le renvoyer. */
export type CreatorProfile = {
  id: string
  username?: string
  firstName?: string
  lastName?: string
  bio?: string
  followersCount?: number
  /** ISO 8601, date d'inscription */
  createdAt?: string
}

type ApiCreator = {
  id: string
  username?: string
  first_name?: string
  last_name?: string
  bio?: string | null
  followers_count?: number
  created_at?: string
}

export const CREATOR_PROFILE_NOTE =
  "creator profile: no GET /catalog/creators/:id route, username, bio, followers and join date are unknown"

/**
 * Profil public d'un créateur. La route n'existe pas encore : null tant qu'elle répond 404 ou
 * échoue, et la page se contente alors de ce qu'elle déduit des agents du créateur.
 */
export const getCreatorProfile = cache(async (id: string): Promise<CreatorProfile | null> => {
  try {
    const res = await fetch(`${MARKETPLACE_API_URL}/catalog/creators/${encodeURIComponent(id)}`, { cache: "no-store" })
    if (!res.ok) return null
    const { data } = (await res.json()) as { data: ApiCreator }
    return {
      id: data.id,
      username: data.username || undefined,
      firstName: data.first_name || undefined,
      lastName: data.last_name || undefined,
      bio: data.bio || undefined,
      followersCount: data.followers_count,
      createdAt: data.created_at,
    }
  } catch {
    return null
  }
})
