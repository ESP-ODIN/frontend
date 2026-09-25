import type { Agent } from "@/components/blocks/agent-icon"
import { agents } from "@/lib/data/agents"
import { genericDetail, overrides, type AgentDetail } from "@/lib/data/agent-details"

export type { AgentDetail }

export async function getAgents(): Promise<Agent[]> {
  return agents
}

export async function getAgent(slug: string): Promise<Agent | null> {
  return agents.find((item) => item.slug === slug) ?? null
}

export async function getAgentDetail(slug: string): Promise<AgentDetail | null> {
  const agent = agents.find((item) => item.slug === slug)
  if (!agent) return null

  return { ...genericDetail(agent, agents), ...overrides[slug] }
}

export async function getSimilarAgents(slugs: string[]): Promise<Agent[]> {
  return slugs
    .map((slug) => agents.find((agent) => agent.slug === slug))
    .filter((agent): agent is Agent => Boolean(agent))
}
