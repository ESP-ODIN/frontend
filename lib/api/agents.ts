import type { Agent } from "@/components/blocks/agent-icon"
import { agents } from "@/lib/data/agents"
import { genericDetail, overrides, type AgentDetail } from "@/lib/data/agent-details"

export type { AgentDetail }

export async function getAgents(): Promise<Agent[]> {
  return agents
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
