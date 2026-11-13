/**
 * Créateurs suivis par l'utilisateur. Mock : stocké dans le localStorage du navigateur en
 * attendant les routes PUT/DELETE /catalog/creators/:id/follow côté API.
 */
const STORAGE_KEY = "odin:creator-follows:v1"

export const CREATOR_FOLLOW_NOTE = "creator follows: stored in this browser's localStorage, no API yet (followers count not available)"

/** Id du créateur -> date (ms) à laquelle il a été suivi. */
export type FollowedCreators = Record<string, number>

function readStore(): FollowedCreators {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeStore(store: FollowedCreators) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {}
}

export async function getFollowedCreators(): Promise<FollowedCreators> {
  return readStore()
}

export async function isFollowingCreator(creatorId: string): Promise<boolean> {
  return creatorId in readStore()
}

export async function followCreator(creatorId: string): Promise<boolean> {
  const store = readStore()
  store[creatorId] ??= Date.now()
  writeStore(store)
  return true
}

export async function unfollowCreator(creatorId: string): Promise<boolean> {
  const store = readStore()
  delete store[creatorId]
  writeStore(store)
  return false
}
