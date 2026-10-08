import type { Agent, AgentRecency } from "@/components/blocks/agent-icon"

export type MarketplaceFilters = {
  categories: string[]
  agent_types: string[]
  runtimes: string[]
  updates: string[]
}

export const emptyFilters: MarketplaceFilters = {
  categories: [],
  agent_types: [],
  runtimes: [],
  updates: [],
}

export function hasActiveFilters(filters: MarketplaceFilters) {
  return (
    filters.categories.length > 0 ||
    filters.agent_types.length > 0 ||
    filters.runtimes.length > 0 ||
    filters.updates.length > 0
  )
}

const recencyRank: Record<AgentRecency, number> = {
  "last-24h": 0,
  "last-week": 1,
  "last-month": 2,
}

const DAY_MS = 24 * 60 * 60 * 1000

export function getRecency(updatedAt: string): AgentRecency {
  const elapsed = Date.now() - new Date(updatedAt).getTime()
  if (elapsed <= DAY_MS) return "last-24h"
  if (elapsed <= 7 * DAY_MS) return "last-week"
  return "last-month"
}

function matchesRecency(agent: Agent, selected: string[]) {
  if (selected.length === 0) return true
  const recency = getRecency(agent.updated_at)
  return selected.some((bucket) => recencyRank[recency] <= recencyRank[bucket as AgentRecency])
}

export function filterAgents(agents: Agent[], filters: MarketplaceFilters) {
  return agents.filter((agent) => {
    if (filters.categories.length > 0 && !filters.categories.includes(agent.category)) return false
    if (filters.agent_types.length > 0 && !filters.agent_types.includes(agent.agent_type)) return false
    if (filters.runtimes.length > 0 && !filters.runtimes.includes(agent.runtime)) return false
    if (!matchesRecency(agent, filters.updates)) return false
    return true
  })
}
