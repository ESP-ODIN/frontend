import type { Agent } from "@/components/blocks/agent-icon"
import { getCategoryLabel } from "@/lib/data/categories"
import { getRuntimeLabel } from "@/lib/publish/constants"

// Lowercase and strip accents so "Révision" matches "revision"
export function normalize(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim()
}

export function tokenize(query: string): string[] {
  return normalize(query).split(/[\s,]+/).filter(Boolean)
}

type SearchField = { text: string; weight: number }

// Weights decide the ranking: a hit on the name beats a hit on a tag, which beats the description
function searchFields(agent: Agent): SearchField[] {
  return [
    { text: agent.name, weight: 10 },
    ...(agent.tags ?? []).map((tag) => ({ text: tag, weight: 8 })),
    { text: getCategoryLabel(agent.category), weight: 4 },
    { text: agent.agent_type, weight: 3 },
    { text: getRuntimeLabel(agent.runtime), weight: 3 },
    { text: agent.creator_id, weight: 2 },
    { text: agent.description, weight: 1 },
  ]
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
    previous = current
  }
  return previous[b.length]
}

// Typos allowed grow with the token: none under 4 chars, 1 up to 6, then 2
function typoBudget(token: string): number {
  if (token.length < 4) return 0
  return token.length <= 6 ? 1 : 2
}

// How well one token matches one text, from 0 (no match) to 1 (exact)
export function matchToken(token: string, text: string): number {
  const haystack = normalize(text)
  if (!haystack) return 0
  if (haystack === token) return 1

  const words = haystack.split(/[^\p{L}\p{N}]+/u).filter(Boolean)
  if (words.includes(token)) return 0.9
  if (words.some((word) => word.startsWith(token))) return 0.75
  if (haystack.includes(token)) return 0.5

  const budget = typoBudget(token)
  if (budget === 0) return 0
  // Compare against the word and its prefix, so "deplo" still finds "deployment" with a typo
  const fuzzy = words.some(
    (word) =>
      levenshtein(token, word) <= budget ||
      (word.length > token.length && levenshtein(token, word.slice(0, token.length)) <= budget)
  )
  return fuzzy ? 0.35 : 0
}

// Every token must match some field (AND); returns null when the agent is out
export function scoreAgent(agent: Agent, tokens: string[]): number | null {
  if (tokens.length === 0) return 0
  const fields = searchFields(agent)
  let total = 0

  for (const token of tokens) {
    let best = 0
    for (const field of fields) {
      best = Math.max(best, matchToken(token, field.text) * field.weight)
    }
    if (best === 0) return null
    total += best
  }

  // Bonus when the whole query reads as the start of the name
  if (normalize(agent.name).startsWith(tokens.join(" "))) total += 5
  return total
}

function hasTags(agent: Agent, tags: string[]): boolean {
  const own = new Set((agent.tags ?? []).map(normalize))
  return tags.every((tag) => own.has(normalize(tag)))
}

// Filters by selected tags, then keeps and ranks the agents matching the free text
export function searchAgents(agents: Agent[], query: string, tags: string[]): Agent[] {
  const withTags = tags.length > 0 ? agents.filter((agent) => hasTags(agent, tags)) : agents
  const tokens = tokenize(query)
  if (tokens.length === 0) return withTags

  return withTags
    .map((agent) => ({ agent, score: scoreAgent(agent, tokens) }))
    .filter((entry): entry is { agent: Agent; score: number } => entry.score !== null)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.agent)
}

export type TagCount = { tag: string; count: number }

export function collectTags(agents: Agent[]): TagCount[] {
  const counts = new Map<string, TagCount>()
  for (const agent of agents) {
    for (const tag of agent.tags ?? []) {
      const key = normalize(tag)
      const entry = counts.get(key)
      if (entry) entry.count++
      else counts.set(key, { tag, count: 1 })
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

// Tags to suggest for the token being typed; the most used ones when nothing is typed yet
export function suggestTags(all: TagCount[], token: string, exclude: string[], limit = 5): TagCount[] {
  const excluded = new Set(exclude.map(normalize))
  const available = all.filter((entry) => !excluded.has(normalize(entry.tag)))
  if (!token) return available.slice(0, limit)

  return available
    .map((entry) => ({ entry, score: matchToken(token, entry.tag) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.entry.count - a.entry.count)
    .slice(0, limit)
    .map(({ entry }) => entry)
}
