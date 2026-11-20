"use client"

import { useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"
import { formatDay, formatNumber, type ChartSeries } from "@/components/dashboard/charts/chart-types"
import { DevMark } from "@/components/dev/dev-mark"

type ChartCardProps = {
  title: string
  description: string
  mockNote?: string
  /** Séries montrées dans la légende et la vue tableau. */
  series: ChartSeries[]
  dates: string[]
  /** Forme de la clé de légende : un trait pour les courbes, un carré pour les colonnes. */
  legendShape: "line" | "rect"
  className?: string
  children: ReactNode
}

function Legend({ series, shape }: { series: ChartSeries[]; shape: "line" | "rect" }) {
  // Une seule série : le titre suffit, pas de légende.
  if (series.length < 2) return null
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
      {series.map((s) => (
        <li key={s.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            aria-hidden
            className={cn("shrink-0", shape === "line" ? "h-0.5 w-3 rounded-full" : "size-2.5 rounded-[3px]")}
            style={{ background: s.color }}
          />
          {s.label}
        </li>
      ))}
    </ul>
  )
}

function DataTable({ series, dates }: { series: ChartSeries[]; dates: string[] }) {
  const rows = dates.map((date, i) => ({ date, values: series.map((s) => s.values[i]) })).reverse()
  return (
    <div className="max-h-64 overflow-auto rounded-lg border border-muted/30">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-background-100 text-left text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="px-3 py-2 font-medium">Day</th>
            {series.map((s) => (
              <th key={s.id} scope="col" className="px-3 py-2 text-right font-medium">{s.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {rows.map((row) => (
            <tr key={row.date} className="border-t border-muted/20">
              <th scope="row" className="px-3 py-1.5 text-left font-normal text-muted-foreground">{formatDay(row.date)}</th>
              {row.values.map((value, i) => (
                <td key={series[i].id} className="px-3 py-1.5 text-right text-foreground">{formatNumber(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Carte d'un graphique : titre, légende, et bascule vers la vue tableau (mêmes données). */
export function ChartCard({ title, description, mockNote, series, dates, legendShape, className, children }: ChartCardProps) {
  const [view, setView] = useState<"chart" | "table">("chart")

  return (
    <section className={cn("flex min-w-0 flex-col gap-4 rounded-2xl border border-muted/40 bg-background-100 p-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            {title} {mockNote && <DevMark kind="mock" note={mockNote} />}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div role="group" aria-label={`${title} view`} className="flex rounded-lg border border-muted/40 p-0.5 text-xs">
          {(["chart", "table"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={view === option}
              onClick={() => setView(option)}
              className={cn(
                "rounded-md px-2.5 py-1 capitalize transition-colors",
                view === option ? "bg-muted/15 font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <Legend series={series} shape={legendShape} />
      {view === "chart" ? children : <DataTable series={series} dates={dates} />}
    </section>
  )
}
