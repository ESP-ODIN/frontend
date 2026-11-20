"use client"

import { useState, type KeyboardEvent, type PointerEvent } from "react"

import { niceTicks } from "@/lib/dashboard/analytics"
import { useElementWidth } from "@/hooks/use-element-width"
import { ChartTooltip } from "@/components/dashboard/charts/chart-tooltip"
import {
  CHART_GRID,
  CHART_SURFACE,
  formatDay,
  formatTick,
  xLabelIndices,
  type ChartSeries,
} from "@/components/dashboard/charts/chart-types"

type LineChartProps = {
  dates: string[]
  series: ChartSeries[]
  height?: number
  ariaLabel: string
}

const MARGIN = { top: 12, right: 12, bottom: 26, left: 44 }

/**
 * Courbes dans le temps, une par série. Crosshair qui se cale sur le jour le plus proche, au
 * pointeur comme au clavier (flèches gauche/droite), avec toutes les séries dans le tooltip.
 */
export function LineChart({ dates, series, height = 260, ariaLabel }: LineChartProps) {
  const { ref, width } = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)

  const count = dates.length
  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
  const innerHeight = height - MARGIN.top - MARGIN.bottom
  const max = Math.max(0, ...series.flatMap((s) => s.values))
  const ticks = niceTicks(max)
  const top = ticks[ticks.length - 1]

  const x = (i: number) => MARGIN.left + (count <= 1 ? innerWidth / 2 : (i / (count - 1)) * innerWidth)
  const y = (value: number) => MARGIN.top + innerHeight - (value / top) * innerHeight

  const linePath = (values: number[]) => values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join("")
  const single = series.length === 1

  function handlePointer(event: PointerEvent<SVGRectElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - box.left) / box.width
    setActive(Math.min(count - 1, Math.max(0, Math.round(ratio * (count - 1)))))
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    const step = event.key === "ArrowRight" ? 1 : -1
    setActive((current) => Math.min(count - 1, Math.max(0, (current ?? count - 1) + step)))
  }

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="group"
      aria-label={`${ariaLabel}. Use the left and right arrow keys to read each day.`}
      onKeyDown={handleKey}
      onBlur={() => setActive(null)}
      className="relative w-full rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      style={{ height }}
    >
      {width > 0 && count > 0 && (
        <svg width={width} height={height} className="block overflow-visible" aria-hidden>
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={MARGIN.left} x2={width - MARGIN.right} y1={y(tick)} y2={y(tick)} stroke={CHART_GRID} />
              <text
                x={MARGIN.left - 8}
                y={y(tick)}
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
              x={x(i)}
              y={height - 6}
              textAnchor={n === all.length - 1 && all.length > 1 ? "end" : n === 0 && i === 0 ? "start" : "middle"}
              className="fill-muted-foreground text-[11px]"
            >
              {formatDay(dates[i])}
            </text>
          ))}

          {single && (
            <path
              d={`${linePath(series[0].values)}L${x(count - 1)},${y(0)}L${x(0)},${y(0)}Z`}
              fill={series[0].color}
              fillOpacity={0.1}
            />
          )}

          {series.map((s) => (
            <path
              key={s.id}
              d={linePath(s.values)}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}

          {active !== null && (
            <line
              x1={x(active)}
              x2={x(active)}
              y1={MARGIN.top}
              y2={MARGIN.top + innerHeight}
              stroke="currentColor"
              className="text-muted-foreground/60"
            />
          )}

          {series.map((s) => {
            const i = active ?? count - 1
            return (
              <circle
                key={s.id}
                cx={x(i)}
                cy={y(s.values[i])}
                r={4}
                fill={s.color}
                stroke={CHART_SURFACE}
                strokeWidth={2}
              />
            )
          })}

          <rect
            x={MARGIN.left}
            y={MARGIN.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onPointerMove={handlePointer}
            onPointerLeave={() => setActive(null)}
          />
        </svg>
      )}

      {active !== null && width > 0 && (
        <ChartTooltip
          title={formatDay(dates[active])}
          x={x(active)}
          containerWidth={width}
          rows={series.map((s) => ({ id: s.id, label: s.label, color: s.color, value: s.values[active] }))}
          total={series.reduce((sum, s) => sum + s.values[active], 0)}
        />
      )}
    </div>
  )
}
