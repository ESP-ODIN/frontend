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

async function persist(id: string, next: AgentInteractionState): Promise<AgentInteractionState> {
  const store = readStore()
  store[id] = next
  writeStore(store)
  return next
}

export async function getAgentInteractions(id: string): Promise<AgentInteractionState> {
  return readStore()[id] ?? defaultState
}

export async function starAgent(id: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(id)
  return persist(id, { ...current, starred: true })
}

export async function unstarAgent(id: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(id)
  return persist(id, { ...current, starred: false })
}

export async function forkAgent(id: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(id)
  return persist(id, { ...current, forked: true })
}

export async function unforkAgent(id: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(id)
  return persist(id, { ...current, forked: false })
}

export async function followAgent(id: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(id)
  return persist(id, { ...current, following: true })
}

export async function unfollowAgent(id: string): Promise<AgentInteractionState> {
  const current = await getAgentInteractions(id)
  return persist(id, { ...current, following: false })
}
