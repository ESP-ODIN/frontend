import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Sparkline } from "@/components/dashboard/charts/sparkline"
import { DevMark, type DevMarkKind } from "@/components/dev/dev-mark"

type StatTileProps = {
  icon: LucideIcon
  label: string
  value: string
  /** Évolution relative vs la période précédente (0.12 = +12 %). */
  change?: number | null
  /** true si une hausse est une bonne nouvelle (installs), false sinon (erreurs). */
  upIsGood?: boolean
  periodLabel?: string
  hint?: string
  trend?: number[]
  devMark?: { kind: DevMarkKind; note: string }
}

function ChangeBadge({ change, upIsGood, periodLabel }: { change: number; upIsGood: boolean; periodLabel?: string }) {
  const up = change >= 0
  const good = up === upIsGood
  const Icon = up ? ArrowUpRight : ArrowDownRight
  const percent = `${up ? "+" : "−"}${Math.abs(change * 100).toFixed(Math.abs(change) < 0.1 ? 1 : 0)}%`

  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <span
        className={cn(
          "inline-flex items-center gap-0.5 rounded-md px-1 py-0.5 font-medium tabular-nums",
          good ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-rose-500/10 text-rose-700 dark:text-rose-400"
        )}
      >
        <Icon aria-hidden className="size-3" />
        {percent}
      </span>
      {periodLabel && <span>vs {periodLabel}</span>}
    </span>
  )
}

/** Tuile de stat : label, valeur, évolution signée vs la période précédente, tendance. */
export function StatTile({ icon: Icon, label, value, change, upIsGood = true, periodLabel, hint, trend, devMark }: StatTileProps) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-muted/40 bg-background-100 p-5">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon aria-hidden className="size-4 text-primary opacity-80" />
        {label}
        {devMark && <DevMark kind={devMark.kind} note={devMark.note} />}
      </p>
      <div className="flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold text-foreground">{value}</p>
        {trend && <Sparkline values={trend} className="mb-1 shrink-0" />}
      </div>
      {change !== undefined && change !== null ? (
        <ChangeBadge change={change} upIsGood={upIsGood} periodLabel={periodLabel} />
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}
