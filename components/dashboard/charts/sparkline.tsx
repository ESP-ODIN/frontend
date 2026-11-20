type SparklineProps = {
  values: number[]
  className?: string
}

const WIDTH = 96
const HEIGHT = 28

/** Tendance d'une stat : trait discret, dernier point (période en cours) en couleur d'accent. */
export function Sparkline({ values, className }: SparklineProps) {
  if (values.length < 2) return null

  const max = Math.max(1, ...values)
  const x = (i: number) => 2 + (i / (values.length - 1)) * (WIDTH - 4)
  const y = (v: number) => HEIGHT - 3 - (v / max) * (HEIGHT - 6)
  const path = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join("")
  const last = values.length - 1

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden className={className}>
      <path d={path} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" className="text-muted-foreground/50" />
      <circle cx={x(last)} cy={y(values[last])} r={3} fill="var(--primary)" stroke="var(--ds-background-100)" strokeWidth={1.5} />
    </svg>
  )
}
