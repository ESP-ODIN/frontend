export function parseCount(label: string): number {
  const cleaned = label.trim().toLowerCase()
  const match = cleaned.match(/^([\d.,]+)\s*(k|m)?$/)
  if (!match) return NaN

  let value = parseFloat(match[1].replace(/,/g, ""))
  if (match[2] === "k") value *= 1_000
  if (match[2] === "m") value *= 1_000_000

  return value
}

export function formatCount(value: number, originalLabel: string): string {
  if (Number.isNaN(value)) return originalLabel

  const isCompact = /[km]$/i.test(originalLabel.trim())
  if (isCompact) {
    return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })
      .format(value)
      .toLowerCase()
  }

  return new Intl.NumberFormat("en-US").format(value)
}
