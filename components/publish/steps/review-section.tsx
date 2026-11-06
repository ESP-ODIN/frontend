import type { ReactNode } from "react"

type ReviewRow = { label: string; value: ReactNode }

export function ReviewSection({
  title,
  rows,
}: {
  title: string
  rows: ReviewRow[]
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-muted/40 bg-background-100 p-4">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </p>
      <dl className="flex flex-col gap-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4 text-sm"
          >
            <dt className="shrink-0 text-muted-foreground">{row.label}</dt>
            <dd className="text-right font-medium text-foreground">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
