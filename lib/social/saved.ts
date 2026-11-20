/**
 * Posts enregistrés. Mock : localStorage du navigateur, l'API social n'a pas de route de favoris.
 */
const STORAGE_KEY = "odin:saved-posts:v1"

export const SAVED_POSTS_NOTE =
  "saved posts: stored in this browser's localStorage, no bookmark route in the social API"

export function readSavedPosts(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

export function writeSavedPosts(ids: Set<string>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  } catch {}
}
