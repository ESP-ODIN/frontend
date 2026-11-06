const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
]

export function formatTimeAgo(isoDate: string): string {
  const elapsed = Date.now() - new Date(isoDate).getTime()
  const format = new Intl.RelativeTimeFormat("en", { numeric: "auto", style: "narrow" })

  for (const [unit, ms] of UNITS) {
    if (elapsed >= ms) return format.format(-Math.floor(elapsed / ms), unit)
  }
  return "just now"
}
