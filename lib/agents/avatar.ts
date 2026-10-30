const PALETTE = ["#e85d04", "#ffb35c", "#ffd8a8", "#fbbf24", "#7c2d12"]
const FALLBACK_STOP = "#14110C"

export const AVATAR_GLYPH_COUNT = 8

export type AgentAvatar = {
  from: string
  to: string
  angle: number
  glyph: number
  blobX: number
  blobY: number
}

function hash(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) {
    h = Math.imul(h ^ value.charCodeAt(i), 16777619)
  }
  return h >>> 0
}

export function getAgentAvatar(name: string): AgentAvatar {
  const h = hash(name.trim().toLowerCase() || "agent")
  const from = PALETTE[h % PALETTE.length]
  const second = PALETTE[(h >>> 8) % PALETTE.length]

  return {
    from,
    to: second === from ? FALLBACK_STOP : second,
    angle: (h >>> 16) % 360,
    glyph: (h >>> 12) % AVATAR_GLYPH_COUNT,
    blobX: 12 + (h % 40),
    blobY: 10 + ((h >>> 4) % 44),
  }
}
