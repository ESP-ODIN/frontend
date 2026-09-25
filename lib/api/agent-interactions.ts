export type AgentInteractionState = {
  starred: boolean
  forked: boolean
  following: boolean
}

const STORAGE_KEY = "odin:agent-interactions"

const defaultState: AgentInteractionState = {
  starred: false,
  forked: false,
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

async function persist(slug: string, next: AgentInteractionState): Promise<AgentInteractionState> {
  const store = readStore()
  store[slug] = next
  writeStore(store)
  return next
}

export async function getAgentInteractions(slug: string): Promise<AgentInteractionState> {
  return readStore()[slug] ?? defaultState
}

export async function starAgent(slug: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(slug)
  return persist(slug, { ...current, starred: true })
}

export async function unstarAgent(slug: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(slug)
  return persist(slug, { ...current, starred: false })
}

export async function forkAgent(slug: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(slug)
  return persist(slug, { ...current, forked: true })
}

export async function unforkAgent(slug: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(slug)
  return persist(slug, { ...current, forked: false })
}

export async function followAgent(slug: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(slug)
  return persist(slug, { ...current, following: true })
}

export async function unfollowAgent(slug: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(slug)
  return persist(slug, { ...current, following: false })
}
