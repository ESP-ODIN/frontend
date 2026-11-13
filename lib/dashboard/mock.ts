import type { Agent } from "@/lib/agents/types"
import {
  HISTORY_DAYS,
  type AgentAnalytics,
  type CreatorDashboardData,
  type DailyActivity,
  type RatingDistribution,
  type ReportedError,
} from "@/lib/dashboard/types"

/*
 * Données mockées du dashboard créateur. L'API marketplace ne donne que `downloads_count` (total
 * depuis la publication) : pas d'historique, pas de notes, pas de remontée d'erreurs. Tout ce qui
 * sort de ce fichier est donc marqué DevMark "mock" dans l'UI. Les valeurs sont dérivées de l'id
 * de l'agent : elles restent identiques d'un rechargement à l'autre.
 */

export const MOCK_NOTES = {
  installs: "installs per day: the API only exposes downloads_count (all-time total), no history",
  ratings: "ratings: no rating system in the API/DB (likes are stored in localStorage)",
  errors: "error reports: no error reporting endpoint in the API",
} as const

const DAY_MS = 24 * 60 * 60 * 1000

export function hashString(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/** PRNG mulberry32 : déterministe pour une graine donnée. */
export function createRandom(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function toDateKey(time: number): string {
  return new Date(time).toISOString().slice(0, 10)
}

function buildDaily(agent: Agent, random: () => number, today: number): DailyActivity[] {
  const base = 8 + random() * 50
  const growth = 0.6 + random() * 1.4 // multiplicateur entre le début et la fin de l'historique
  const errorRate = 0.004 + random() * 0.02
  const publishedAt = agent.created_at ? Date.parse(agent.created_at) : 0

  return Array.from({ length: HISTORY_DAYS }, (_, i) => {
    const time = today - (HISTORY_DAYS - 1 - i) * DAY_MS
    if (time < publishedAt - DAY_MS) return { date: toDateKey(time), installs: 0, errors: 0 }

    const progress = i / (HISTORY_DAYS - 1)
    const weekday = new Date(time).getUTCDay()
    const weekend = weekday === 0 || weekday === 6 ? 0.65 : 1
    const noise = 0.7 + random() * 0.6
    const spike = random() > 0.97 ? 1.8 + random() : 1
    const installs = Math.round(base * (1 + (growth - 1) * progress) * weekend * noise * spike)
    const errors = Math.round(installs * errorRate * (0.4 + random() * 1.6))

    return { date: toDateKey(time), installs, errors }
  })
}

function buildRatings(random: () => number): RatingDistribution {
  const total = 20 + Math.round(random() * 260)
  const quality = 0.55 + random() * 0.4 // plus c'est haut, plus les notes tirent vers 5
  const weights = [0.04, 0.06, 0.14, 0.36, 0.4].map((w, i) => w * (i >= 3 ? quality * 2 : 1 - quality + 0.3))
  const sum = weights.reduce((a, b) => a + b, 0)
  return weights.map((w) => Math.round((w / sum) * total)) as RatingDistribution
}

const ERROR_SAMPLES = [
  { code: "E_TIMEOUT", message: "Run exceeded the 120s execution limit" },
  { code: "E_ENV_MISSING", message: "Required environment variable is not set" },
  { code: "E_NETWORK", message: "Outbound request blocked: network access is disabled" },
  { code: "E_FS_DENIED", message: "Write attempted on a read-only filesystem" },
  { code: "E_CMD_DENIED", message: "Terminal command not in the allowed list" },
  { code: "E_EXIT_1", message: "Entrypoint exited with status 1" },
  { code: "E_RATE_LIMIT", message: "Upstream API answered 429 Too Many Requests" },
]

function buildErrors(analytics: AgentAnalytics[], today: number): ReportedError[] {
  return analytics.flatMap(({ agent, daily }) => {
    const random = createRandom(hashString(`${agent.id}:errors`))
    const totalErrors = daily.reduce((sum, day) => sum + day.errors, 0)
    if (totalErrors === 0) return []

    const count = 2 + Math.floor(random() * 3)
    return Array.from({ length: count }, (_, i) => {
      const sample = ERROR_SAMPLES[Math.floor(random() * ERROR_SAMPLES.length)]
      const daysAgo = Math.floor(random() * random() * 60)
      return {
        id: `${agent.id}-${i}`,
        agentId: agent.id,
        code: sample.code,
        message: sample.message,
        occurrences: 1 + Math.round(random() * totalErrors * 0.3),
        lastSeen: new Date(today - daysAgo * DAY_MS - Math.floor(random() * DAY_MS)).toISOString(),
        status: daysAgo > 14 && random() > 0.3 ? "resolved" : "open",
      } satisfies ReportedError
    })
  })
}

/** Construit les analytics mockées des agents d'un créateur. `now` est injecté pour les tests. */
export function buildMockDashboard(agents: Agent[], now: number = Date.now()): CreatorDashboardData {
  const today = Date.UTC(new Date(now).getUTCFullYear(), new Date(now).getUTCMonth(), new Date(now).getUTCDate())

  const analytics = agents.map((agent) => {
    const random = createRandom(hashString(agent.id))
    return { agent, daily: buildDaily(agent, random, today), ratings: buildRatings(random) }
  })

  const errors = buildErrors(analytics, today).sort((a, b) => b.lastSeen.localeCompare(a.lastSeen))

  return { analytics, errors, generatedAt: now }
}
