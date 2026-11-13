/**
 * Like, dislike et save d'un agent (le follow concerne les créateurs : lib/api/creator-follows.ts). Mock : stocké dans le localStorage du navigateur en
 * attendant une API.
 */
export type AgentInteractionState = {
  liked: boolean
  disliked: boolean
  saved: boolean
}

/** Date (ms) à laquelle chaque relation a été activée, pour trier la bibliothèque du profil. */
export type AgentInteractionDates = { likedAt?: number; savedAt?: number }

/** Les anciennes entrées peuvent encore contenir `following` / `followingAt` : ignorés. */
type StoredInteraction = AgentInteractionState & AgentInteractionDates & { following?: boolean; followingAt?: number }

const STORAGE_KEY = "odin:agent-interactions:v2"

const defaultState: AgentInteractionState = {
  liked: false,
  disliked: false,
  saved: false,
}

function readStore(): Record<string, StoredInteraction> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, StoredInteraction>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {}
}

const DATE_KEYS = [
  ["liked", "likedAt"],
  ["saved", "savedAt"],
] as const

async function persist(id: string, next: AgentInteractionState): Promise<AgentInteractionState> {
  const store = readStore()
  const previous = store[id]
  const stored: StoredInteraction = { ...previous, ...next }
  for (const [flag, dateKey] of DATE_KEYS) {
    if (!next[flag]) delete stored[dateKey]
    else if (!previous?.[flag]) stored[dateKey] = Date.now()
  }
  store[id] = stored
  writeStore(store)
  return next
}

/** Toutes les interactions enregistrées, par id d'agent (page profil). */
export async function getAllAgentInteractions(): Promise<Record<string, AgentInteractionState & AgentInteractionDates>> {
  const store = readStore()
  return Object.fromEntries(
    Object.entries(store).map(([id, { liked, disliked, saved, likedAt, savedAt }]) => [
      id,
      { ...defaultState, liked, disliked, saved, likedAt, savedAt },
    ])
  )
}

export async function getAgentInteractions(id: string): Promise<AgentInteractionState> {
  const { liked, disliked, saved } = { ...defaultState, ...readStore()[id] }
  return { liked, disliked, saved }
}

export async function likeAgent(id: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(id)
  return persist(id, { ...current, liked: true, disliked: false })
}

export async function unlikeAgent(id: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(id)
  return persist(id, { ...current, liked: false })
}

export async function dislikeAgent(id: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(id)
  return persist(id, { ...current, disliked: true, liked: false })
}

export async function undislikeAgent(id: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(id)
  return persist(id, { ...current, disliked: false })
}

export async function saveAgent(id: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(id)
  return persist(id, { ...current, saved: true })
}

export async function unsaveAgent(id: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(id)
  return persist(id, { ...current, saved: false })
}


