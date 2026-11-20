import type { Agent } from "@/lib/agents/types"
import { scoreCreator, tokenize } from "@/lib/agents/search"

/** Page publique d'un créateur. */
export function creatorHref(creatorId: string): string {
  return `/creators/${encodeURIComponent(creatorId)}`
}

/** "f572fbc1-0a1d-…" -> "f572fbc1", en attendant le pseudo du créateur dans l'API. */
export function shortCreatorId(creatorId: string): string {
  return creatorId.split("-")[0]
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const CREATOR_NAME_NOTE = "creator username: the API only returns creator_id, the start of the id is shown instead"

/** "@pseudo" si l'API le renvoie, sinon le début de l'id. */
export function creatorLabel(agent: Pick<Agent, "creator_id" | "creator_username">): string {
  return agent.creator_username ? `@${agent.creator_username}` : shortCreatorId(agent.creator_id)
}

export type Creator = {
  id: string
  username?: string
  name?: string
  agentCount: number
  installs: number
}

/**
 * Créateurs déduits du catalogue (il n'y a pas de route qui liste les créateurs) : un par
 * creator_id, avec son nombre d'agents et ses installs.
 */
export function collectCreators(agents: Agent[]): Creator[] {
  const byId = new Map<string, Creator>()
  for (const agent of agents) {
    const creator = byId.get(agent.creator_id) ?? { id: agent.creator_id, agentCount: 0, installs: 0 }
    creator.agentCount += 1
    creator.installs += agent.downloads_count
    creator.username ??= agent.creator_username
    creator.name ??= agent.creator_name
    byId.set(agent.creator_id, creator)
  }
  return [...byId.values()]
}

export function creatorDisplayName(creator: Creator): string {
  return creator.username ? `@${creator.username}` : shortCreatorId(creator.id)
}

/**
 * Créateurs dont le pseudo, le nom ou l'id correspond à la recherche (un "@" en tête est ignoré),
 * les mieux classés d'abord puis ceux qui ont le plus d'agents.
 */
export function searchCreators(creators: Creator[], query: string, limit = 3): Creator[] {
  const tokens = tokenize(query.replace(/^@/, ""))
  if (tokens.length === 0) return []

  return creators
    .map((creator) => ({ creator, score: scoreCreator(creator, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.creator.agentCount - a.creator.agentCount)
    .slice(0, limit)
    .map(({ creator }) => creator)
}
