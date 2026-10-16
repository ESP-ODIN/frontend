export type AgentInteractionState = {
  liked: boolean
  disliked: boolean
  saved: boolean
  following: boolean
}

const STORAGE_KEY = "odin:agent-interactions:v2"

const defaultState: AgentInteractionState = {
  liked: false,
  disliked: false,
  saved: false,
  following: false,
}

function readStore(): Record<string, AgentInteractionState> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, AgentInteractionState>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {}
}

async function persist(id: string, next: AgentInteractionState): Promise<AgentInteractionState> {
  const store = readStore()
  store[id] = next
  writeStore(store)
  return next
}

export async function getAgentInteractions(id: string): Promise<AgentInteractionState> {
  return { ...defaultState, ...readStore()[id] }
}

// Like and dislike are mutually exclusive: setting one clears the other
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

export async function followAgent(id: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(id)
  return persist(id, { ...current, following: true })
}

export async function unfollowAgent(id: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(id)
  return persist(id, { ...current, following: false })
}
