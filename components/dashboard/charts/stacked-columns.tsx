"use client"

import { useState } from "react"

import { niceTicks } from "@/lib/dashboard/analytics"
import { useElementWidth } from "@/hooks/use-element-width"
import { ChartTooltip } from "@/components/dashboard/charts/chart-tooltip"
import {
  CHART_GRID,
  formatDay,
  formatTick,
  xLabelIndices,
  type ChartSeries,
} from "@/components/dashboard/charts/chart-types"

type StackedColumnsProps = {
  dates: string[]
  series: ChartSeries[]
  height?: number
  ariaLabel: string
}

const MARGIN = { top: 12, right: 8, bottom: 26, left: 36 }
const MAX_BAR = 24
const GAP = 2
const RADIUS = 4

/** Rectangle aux coins supérieurs arrondis (bout de la donnée), carré sur la ligne de base. */
function topRoundedPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(RADIUS, w / 2, h)
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`
}

/**
 * Colonnes empilées par jour, une couleur par série, séparées par un espace de 2px. Chaque colonne
 * est sa propre zone de survol / focus, avec le détail par série dans le tooltip.
 */
export function StackedColumns({ dates, series, height = 220, ariaLabel }: StackedColumnsProps) {
  const { ref, width } = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)

  const count = dates.length
  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
  const innerHeight = height - MARGIN.top - MARGIN.bottom
  const totals = dates.map((_, i) => series.reduce((sum, s) => sum + s.values[i], 0))
  const ticks = niceTicks(Math.max(0, ...totals))
  const top = ticks[ticks.length - 1]

  const band = count > 0 ? innerWidth / count : 0
  const barWidth = Math.max(1, Math.min(MAX_BAR, band - GAP))
  const scale = (value: number) => (value / top) * innerHeight
  const baseline = MARGIN.top + innerHeight

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      className="relative w-full"
      style={{ height }}
      onMouseLeave={() => setActive(null)}
    >
      {width > 0 && count > 0 && (
        <svg width={width} height={height} className="block overflow-visible">
          {ticks.map((tick) => (
            <g key={tick} aria-hidden>
              <line x1={MARGIN.left} x2={width - MARGIN.right} y1={baseline - scale(tick)} y2={baseline - scale(tick)} stroke={CHART_GRID} />
              <text
                x={MARGIN.left - 8}
                y={baseline - scale(tick)}
                dy="0.32em"
                textAnchor="end"
                className="fill-muted-foreground text-[11px] tabular-nums"
              >
                {formatTick(tick, top)}
              </text>
            </g>
          ))}

          {xLabelIndices(count, width < 480 ? 4 : 7).map((i, n, all) => (
            <text
              key={i}
              aria-hidden
              x={MARGIN.left + band * i + band / 2}
              y={height - 6}
              textAnchor={n === all.length - 1 && all.length > 1 ? "end" : n === 0 && i === 0 ? "start" : "middle"}
              className="fill-muted-foreground text-[11px]"
            >
              {formatDay(dates[i])}
            </text>
          ))}

          {dates.map((date, i) => {
            const bx = MARGIN.left + band * i + (band - barWidth) / 2
            const visible = series.filter((s) => s.values[i] > 0)
            let cursor = baseline

            return (
              <g
                key={date}
                tabIndex={0}
                role="img"
                aria-label={`${formatDay(date)}: ${totals[i]} errors`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="outline-none"
                opacity={active === null || active === i ? 1 : 0.55}
              >
                <rect x={MARGIN.left + band * i} y={MARGIN.top} width={band} height={innerHeight} fill="transparent" />
                {visible.map((s, n) => {
                  const h = scale(s.values[i])
                  const gap = n === 0 ? 0 : GAP
                  const segment = Math.max(0, h - gap)
                  cursor -= h
                  const sy = cursor
                  return n === visible.length - 1 ? (
                    <path key={s.id} d={topRoundedPath(bx, sy, barWidth, segment)} fill={s.color} />
                  ) : (
                    <rect key={s.id} x={bx} y={sy} width={barWidth} height={segment} fill={s.color} />
                  )
                })}
              </g>
            )
          })}
        </svg>
      )}

      {active !== null && width > 0 && (
        <ChartTooltip
          title={formatDay(dates[active])}
          x={MARGIN.left + band * active + band / 2}
          containerWidth={width}
          rows={series.map((s) => ({ id: s.id, label: s.label, color: s.color, value: s.values[active] }))}
          total={totals[active]}
        />
      )}
    </div>
  )
}
