import type { Agent, AgentType } from "@/components/blocks/agent-icon"
import type { CategoryId } from "@/lib/data/categories"
import { agents } from "@/lib/data/agents"
import { genericDetail, overrides, type AgentDetail } from "@/lib/data/agent-details"

export type { AgentDetail }

type ApiAgent = {
  id: string
  name: string
  creator_id: string
  category: CategoryId
  agent_type: AgentType
  runtime: string
  description?: string
  is_official_pick: boolean
  downloads_count: number
  updated_at: string
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
    category: apiAgent.category,
    agent_type: apiAgent.agent_type,
    runtime: apiAgent.runtime,
    updated_at: apiAgent.updated_at,
  }
}

export async function getAgents(): Promise<Agent[]> {
  return agents
}

export async function getMarketplaceAgents(): Promise<Agent[]> {
  const res = await fetch(`${MARKETPLACE_API_URL}/catalog/agents`, { cache: "no-store" })
  if (!res.ok) throw new Error(`Marketplace API responded with ${res.status}`)

  const { data } = (await res.json()) as { data: ApiAgent[] }
  return data.map(toAgent)
}

export async function getAgent(id: string): Promise<Agent | null> {
  return agents.find((item) => item.id === id) ?? null
}

export async function getAgentDetail(id: string): Promise<AgentDetail | null> {
  const agent = agents.find((item) => item.id === id)
  if (!agent) return null

  return { ...genericDetail(agent, agents), ...overrides[id] }
}

export async function getSimilarAgents(ids: string[]): Promise<Agent[]> {
  return ids
    .map((id) => agents.find((agent) => agent.id === id))
    .filter((agent): agent is Agent => Boolean(agent))
}
