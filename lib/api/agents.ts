import { cache } from "react"

import type { Agent, AgentType } from "@/components/blocks/agent-icon"
import type { CategoryId } from "@/lib/data/categories"
import { limitTags } from "@/lib/agent-tags"

type ApiAgent = {
  id: string
  name: string
  creator_id: string
  category: CategoryId
  agent_type: AgentType
  runtime: string
  description?: string
  tags?: string[]
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
  likesLabel?: string
  savesLabel?: string
  uptimeLabel?: string
  sizeLabel?: string
  overview: string[]
  installSteps: { comment: string; command: string }[]
  configFilename: string
  configLines: string[]
  checks: { title: string; description: string }[]
  permissions: { label: string; granted: boolean }[]
}

const MARKETPLACE_API_URL = process.env.MARKETPLACE_API_URL

function toAgent(apiAgent: ApiAgent): Agent {
  return {
    id: apiAgent.id,
    name: apiAgent.name,
    creator_id: apiAgent.creator_id,
    description: apiAgent.description ?? "",
    tags: limitTags(apiAgent.tags),
    downloads_count: apiAgent.downloads_count,
    is_official_pick: apiAgent.is_official_pick,
    featured: apiAgent.featured ?? true,
    category: apiAgent.category,
    agent_type: apiAgent.agent_type,
    runtime: apiAgent.runtime,
    created_at: apiAgent.created_at,
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
  }
}

// cache() dedupes calls within a single server render (metadata + page + sidebar)
export const getMarketplaceAgents = cache(async (): Promise<Agent[]> => {
  const res = await fetch(`${MARKETPLACE_API_URL}/catalog/agents`, { cache: "no-store" })
  if (!res.ok) throw new Error(`Marketplace API responded with ${res.status}`)

  const { data } = (await res.json()) as { data: ApiAgent[] }
  return data.map(toAgent)
})

// 400 = id is not a UUID, 404 = no agent with this id: both mean "not found" for the page.
// cache() makes getAgent + getAgentDetail + generateMetadata share a single request.
const fetchApiAgent = cache(async (id: string): Promise<ApiAgent | null> => {
  const res = await fetch(`${MARKETPLACE_API_URL}/catalog/agents/${encodeURIComponent(id)}`, {
    cache: "no-store",
  })
  if (res.status === 400 || res.status === 404) return null
  if (!res.ok) throw new Error(`Marketplace API responded with ${res.status}`)

  const { data } = (await res.json()) as { data: ApiAgent }
  return data
})

export async function getAgent(id: string): Promise<Agent | null> {
  const apiAgent = await fetchApiAgent(id)
  return apiAgent ? toAgent(apiAgent) : null
}

export async function getAgentDetail(id: string): Promise<AgentDetail | null> {
  const apiAgent = await fetchApiAgent(id)
  return apiAgent ? toAgentDetail(apiAgent) : null
}

const SIMILAR_AGENTS_LIMIT = 3

// Computed client-side until the API exposes similar agents: one point per shared
// trait (category, type, runtime, tag), ties broken by downloads
function similarityScore(agent: Agent, other: Agent): number {
  const sharedTags = (other.tags ?? []).filter((tag) => agent.tags?.includes(tag)).length
  return (
    Number(other.category === agent.category) +
    Number(other.agent_type === agent.agent_type) +
    Number(other.runtime === agent.runtime) +
    sharedTags
  )
}

export async function getSimilarAgents(agent: Agent): Promise<Agent[]> {
  const agents = await getMarketplaceAgents()

  return agents
    .filter((other) => other.id !== agent.id)
    .map((other) => ({ other, score: similarityScore(agent, other) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.other.downloads_count - a.other.downloads_count)
    .slice(0, SIMILAR_AGENTS_LIMIT)
    .map(({ other }) => other)
}
