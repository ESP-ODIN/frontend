import { cn } from "@/lib/utils"
import { formatNumber } from "@/components/dashboard/charts/chart-types"

export type TooltipRow = { id: string; label: string; color: string; value: number }

type ChartTooltipProps = {
  title: string
  rows: TooltipRow[]
  total?: number
  /** Position du point visé, en px depuis la gauche du conteneur. */
  x: number
  containerWidth: number
}

const TOOLTIP_WIDTH = 184

/** Lecture au survol : la valeur en avant, le nom de la série en second, clé en trait de couleur. */
export function ChartTooltip({ title, rows, total, x, containerWidth }: ChartTooltipProps) {
  const flip = x + 12 + TOOLTIP_WIDTH > containerWidth
  const left = flip ? Math.max(0, x - 12 - TOOLTIP_WIDTH) : x + 12

  return (
    <div
      role="status"
      className="pointer-events-none absolute top-2 z-10 flex flex-col gap-1.5 rounded-lg border border-muted/30 bg-popover/95 p-2.5 text-xs shadow-lg backdrop-blur-sm"
      style={{ left, width: TOOLTIP_WIDTH }}
    >
      <p className="font-mono text-[11px] text-muted-foreground">{title}</p>
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-2">
          <span aria-hidden className="h-0.5 w-3 shrink-0 rounded-full" style={{ background: row.color }} />
          <span className="font-semibold text-foreground tabular-nums">{formatNumber(row.value)}</span>
          <span className="min-w-0 truncate text-muted-foreground">{row.label}</span>
        </div>
      ))}
      {total !== undefined && rows.length > 1 && (
        <div className={cn("mt-0.5 flex items-center gap-2 border-t border-muted/30 pt-1.5")}>
          <span className="w-3 shrink-0" />
          <span className="font-semibold text-foreground tabular-nums">{formatNumber(total)}</span>
          <span className="text-muted-foreground">Total</span>
        </div>
      )}
    </div>
  )
}
