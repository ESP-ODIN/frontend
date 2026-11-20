/** Une série tracée : `color` est une variable CSS (var(--viz-1)…), jamais une couleur de texte. */
export type ChartSeries = {
  id: string
  label: string
  color: string
  values: number[]
}

export const CHART_SURFACE = "var(--ds-background-100)"
export const CHART_GRID = "var(--viz-grid)"

const dayFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" })

/** "2026-11-13" -> "Nov 13" (UTC, identique côté serveur et client). */
export function formatDay(date: string): string {
  return dayFormatter.format(new Date(`${date}T00:00:00Z`))
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US")
}

/** Graduations de l'axe Y : en entier sous 10 000, compactes au-delà (10K, 20K). */
export function formatTick(value: number, max: number): string {
  if (max < 10_000) return formatNumber(value)
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value)
}

/**
 * Indices des dates affichées sous l'axe X : au plus `count`, à pas constant en partant du jour
 * le plus récent (toujours affiché), pour un espacement régulier.
 */
export function xLabelIndices(length: number, count: number): number[] {
  if (length <= 1) return [0]
  const step = Math.max(1, Math.ceil((length - 1) / Math.max(1, count - 1)))
  const indices: number[] = []
  for (let i = length - 1; i >= 0; i -= step) indices.unshift(i)
  return indices
}
