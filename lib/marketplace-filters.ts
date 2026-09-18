import type { Agent, AgentRecency } from "@/components/blocks/agent-icon"

export type MarketplaceFilters = {
  categories: string[]
  types: string[]
  languages: string[]
  updates: string[]
}

export const emptyFilters: MarketplaceFilters = {
  categories: [],
  types: [],
  languages: [],
  updates: [],
}

export function hasActiveFilters(filters: MarketplaceFilters) {
  return (
    filters.categories.length > 0 ||
    filters.types.length > 0 ||
    filters.languages.length > 0 ||
    filters.updates.length > 0
  )
}

// "Dernières 24h" agents are also within "la semaine dernière" and "le mois
// dernier" — each bucket includes everything more recent than it.
const recencyRank: Record<AgentRecency, number> = {
  "last-24h": 0,
  "last-week": 1,
  "last-month": 2,
}

function matchesRecency(agent: Agent, selected: string[]) {
  if (selected.length === 0) return true
  return selected.some((bucket) => recencyRank[agent.recency] <= recencyRank[bucket as AgentRecency])
}

export function filterAgents(agents: Agent[], filters: MarketplaceFilters) {
  return agents.filter((agent) => {
    if (filters.categories.length > 0 && !filters.categories.includes(agent.category.slug)) return false
    if (filters.types.length > 0 && !filters.types.includes(agent.type)) return false
    if (filters.languages.length > 0 && !filters.languages.includes(agent.language)) return false
    if (!matchesRecency(agent, filters.updates)) return false
    return true
  })
}
