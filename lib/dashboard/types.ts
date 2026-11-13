import type { Agent } from "@/lib/agents/types"

/** Une journée d'activité d'un agent. `date` au format YYYY-MM-DD (UTC). */
export type DailyActivity = {
  date: string
  installs: number
  errors: number
}

/** Nombre de notes reçues par nombre d'étoiles : index 0 = 1 étoile, index 4 = 5 étoiles. */
export type RatingDistribution = [number, number, number, number, number]

export type AgentAnalytics = {
  agent: Agent
  /** Du plus ancien au plus récent, sur HISTORY_DAYS jours (de quoi comparer à la période précédente). */
  daily: DailyActivity[]
  ratings: RatingDistribution
}

export type ErrorStatus = "open" | "resolved"

export type ReportedError = {
  id: string
  agentId: string
  code: string
  message: string
  occurrences: number
  /** ISO 8601 */
  lastSeen: string
  status: ErrorStatus
}

export type CreatorDashboardData = {
  analytics: AgentAnalytics[]
  errors: ReportedError[]
  /** Instant de génération (ms) : sert de "maintenant" côté client, pour un rendu identique au SSR. */
  generatedAt: number
}

export const RANGE_OPTIONS = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
] as const

export type RangeDays = (typeof RANGE_OPTIONS)[number]["days"]

/** Deux fois la plus grande période, pour calculer l'évolution par rapport à la période précédente. */
export const HISTORY_DAYS = 180
