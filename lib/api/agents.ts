import type { Agent, AgentType } from "@/components/blocks/agent-icon"
import type { CategoryId } from "@/lib/data/categories"

type ApiAgent = {
  id: string
  name: string
  creator_id: string
  category: CategoryId
  agent_type: AgentType
  runtime: string
  description?: string
  is_official_pick: boolean
  featured?: boolean
  downloads_count: number
  created_at: string
  updated_at: string
}

export type AgentDetail = {
  category: CategoryId
  updated_at: string
  created_at: string
  downloads_count: number
  runtime: string
  starsLabel?: string
  forksLabel?: string
  ratingLabel?: string
  uptimeLabel?: string
  license?: string
  sizeLabel?: string
  overview: string[]
  installSteps: { comment: string; command: string }[]
  configFilename: string
  configLines: string[]
  checks: { title: string; description: string }[]
  permissions: { label: string; granted: boolean }[]
  dependencies: string[]
  similar: string[]
}

const MARKETPLACE_API_URL = process.env.MARKETPLACE_API_URL

function toAgent(apiAgent: ApiAgent): Agent {
  return {
    id: apiAgent.id,
    name: apiAgent.name,
    creator_id: apiAgent.creator_id,
    description: apiAgent.description ?? "",
    downloads_count: apiAgent.downloads_count,
    is_official_pick: apiAgent.is_official_pick,
    featured: apiAgent.featured ?? false,
    category: apiAgent.category,
    agent_type: apiAgent.agent_type,
    runtime: apiAgent.runtime,
    updated_at: apiAgent.updated_at,
  }
}

function toAgentDetail(apiAgent: ApiAgent): AgentDetail {
  return {
    category: apiAgent.category,
    updated_at: apiAgent.updated_at,
    created_at: apiAgent.created_at,
    downloads_count: apiAgent.downloads_count,
    runtime: apiAgent.runtime,
    overview: [apiAgent.description ?? ""],
    installSteps: [
      { comment: "1. Installer l'agent", command: `odin install ${apiAgent.name}` },
      { comment: "2. Lancer l'agent", command: `odin run ${apiAgent.name}` },
    ],
    configFilename: `.odin/${apiAgent.name}.json`,
    configLines: ["{", `  "model": "claude-3-5-sonnet"`, "}"],
    checks: [],
    permissions: [],
    dependencies: [],
    similar: [],
  }
}

export async function getMarketplaceAgents(): Promise<Agent[]> {
  const res = await fetch(`${MARKETPLACE_API_URL}/catalog/agents`, { cache: "no-store" })
  if (!res.ok) throw new Error(`Marketplace API responded with ${res.status}`)

  const { data } = (await res.json()) as { data: ApiAgent[] }
  return data.map(toAgent)
}

// 400 = id is not a UUID, 404 = no agent with this id: both mean "not found" for the page
async function fetchApiAgent(id: string): Promise<ApiAgent | null> {
  const res = await fetch(`${MARKETPLACE_API_URL}/catalog/agents/${encodeURIComponent(id)}`, {
    cache: "no-store",
  })
  if (res.status === 400 || res.status === 404) return null
  if (!res.ok) throw new Error(`Marketplace API responded with ${res.status}`)

  const { data } = (await res.json()) as { data: ApiAgent }
  return data
}

export async function getAgent(id: string): Promise<Agent | null> {
  const apiAgent = await fetchApiAgent(id)
  return apiAgent ? toAgent(apiAgent) : null
}

export async function getAgentDetail(id: string): Promise<AgentDetail | null> {
  const apiAgent = await fetchApiAgent(id)
  return apiAgent ? toAgentDetail(apiAgent) : null
}

export async function getSimilarAgents(ids: string[]): Promise<Agent[]> {
  if (ids.length === 0) return []

  const agents = await getMarketplaceAgents()
  return agents.filter((agent) => ids.includes(agent.id))
}
