import type { AgentAnalytics, DailyActivity, DailyMetric } from "@/lib/dashboard/types"

/** Les `days` derniers jours, ou la période juste avant si `previous` est vrai. */
export function sliceRange(daily: DailyActivity[], days: number, previous = false): DailyActivity[] {
  const end = previous ? daily.length - days : daily.length
  return daily.slice(Math.max(0, end - days), Math.max(0, end))
}

export function sumBy(daily: DailyActivity[], key: DailyMetric): number {
  return daily.reduce((sum, day) => sum + day[key], 0)
}

/** Somme jour par jour de plusieurs agents (ils partagent les mêmes dates). */
export function mergeDaily(analytics: AgentAnalytics[]): DailyActivity[] {
  if (analytics.length === 0) return []
  return analytics[0].daily.map((day, i) => ({
    date: day.date,
    installs: analytics.reduce((sum, item) => sum + item.daily[i].installs, 0),
    errors: analytics.reduce((sum, item) => sum + item.daily[i].errors, 0),
    likes: analytics.reduce((sum, item) => sum + item.daily[i].likes, 0),
    dislikes: analytics.reduce((sum, item) => sum + item.daily[i].dislikes, 0),
  }))
}

/** Part des likes parmi les likes et dislikes (0 à 1), ou null sans aucun avis. */
export function likeShare(likes: number, dislikes: number): number | null {
  const total = likes + dislikes
  return total === 0 ? null : likes / total
}

/** Évolution relative entre deux périodes, ou null si la précédente est vide. */
export function relativeChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return (current - previous) / previous
}

/** Regroupe une série en `count` paquets (somme), pour les sparklines. */
export function bucket(values: number[], count: number): number[] {
  if (values.length <= count) return values
  const size = values.length / count
  return Array.from({ length: count }, (_, i) =>
    values.slice(Math.floor(i * size), Math.floor((i + 1) * size)).reduce((a, b) => a + b, 0)
  )
}

/** Graduations "rondes" et entières (on compte des installs / erreurs) de 0 jusqu'au moins `max`. */
export function niceTicks(max: number, target = 4): number[] {
  if (max <= 0) return [0, 1]
  const rough = Math.max(1, max / target)
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).filter(Number.isInteger).find((s) => s >= rough) ?? Math.ceil(rough)
  const ticks: number[] = []
  for (let v = 0; v < max + step; v += step) ticks.push(Math.round(v * 100) / 100)
  return ticks
}
