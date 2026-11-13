/** Page publique d'un créateur. */
export function creatorHref(creatorId: string): string {
  return `/creators/${encodeURIComponent(creatorId)}`
}

/** "f572fbc1-0a1d-…" -> "f572fbc1", en attendant le pseudo du créateur dans l'API. */
export function shortCreatorId(creatorId: string): string {
  return creatorId.split("-")[0]
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
