import type { Agent } from "@/lib/agents/types"

/** Nombre d'auteurs ayant au moins un agent dans la liste (et non tous les profils de la base). */
export function countAuthors(agents: Agent[]): number {
  return new Set(agents.map((agent) => agent.creator_id)).size
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** Tire des agents au hasard en commençant par un agent featured s'il y en a un. */
export function pickRandomAgents(agents: Agent[], count: number): Agent[] {
  const [first] = shuffle(agents.filter((agent) => agent.featured))
  const rest = shuffle(agents.filter((agent) => agent !== first))
  return (first ? [first, ...rest] : rest).slice(0, count)
}
