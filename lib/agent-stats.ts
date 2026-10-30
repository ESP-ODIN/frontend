import type { Agent } from "@/components/blocks/agent-icon"

// Only creators with at least one agent in the list, not every profile in the base
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

// Random picks, starting with a featured agent when there is one
export function pickRandomAgents(agents: Agent[], count: number): Agent[] {
  const [first] = shuffle(agents.filter((agent) => agent.featured))
  const rest = shuffle(agents.filter((agent) => agent !== first))
  return (first ? [first, ...rest] : rest).slice(0, count)
}
