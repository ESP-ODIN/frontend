import { CircleAlert, CircleCheck } from "lucide-react"

import { formatTimeAgo } from "@/lib/format/time-ago"
import { MOCK_NOTES } from "@/lib/dashboard/mock"
import type { ErrorStatus, ReportedError } from "@/lib/dashboard/types"
import { cn } from "@/lib/utils"
import { formatNumber } from "@/components/dashboard/charts/chart-types"
import { DevMark } from "@/components/dev/dev-mark"

type ErrorsTableProps = {
  errors: ReportedError[]
  agentNames: Record<string, string>
}

const STATUS: Record<ErrorStatus, { label: string; icon: typeof CircleAlert; className: string }> = {
  open: { label: "Open", icon: CircleAlert, className: "text-amber-700 dark:text-amber-400" },
  resolved: { label: "Resolved", icon: CircleCheck, className: "text-emerald-700 dark:text-emerald-400" },
}

/** Erreurs remontées par les utilisateurs, les plus récentes d'abord. Statut = icône + texte. */
export function ErrorsTable({ errors, agentNames }: ErrorsTableProps) {
  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-2xl border border-muted/40 bg-background-100 p-5">
      <div>
        <h2 className="flex items-center gap-2 font-semibold text-foreground">
          Reported errors <DevMark kind="mock" note={MOCK_NOTES.errors} />
        </h2>
        <p className="text-sm text-muted-foreground">Errors your users ran into, grouped by type.</p>
      </div>

      {errors.length === 0 ? (
        <p className="rounded-lg border border-dashed border-muted/40 p-6 text-center text-sm text-muted-foreground">
          No errors reported over this period.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-xl text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="pb-2 font-medium">Error</th>
                <th scope="col" className="pb-2 font-medium">Agent</th>
                <th scope="col" className="pb-2 text-right font-medium">Occurrences</th>
                <th scope="col" className="pb-2 text-right font-medium">Last seen</th>
                <th scope="col" className="pb-2 pl-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {errors.map((error) => {
                const status = STATUS[error.status]
                return (
                  <tr key={error.id} className="border-t border-muted/20 align-top">
                    <td className="py-2.5 pr-4">
                      <p className="font-mono text-xs font-semibold text-foreground">{error.code}</p>
                      <p className="text-muted-foreground">{error.message}</p>
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs whitespace-nowrap text-foreground">
                      {agentNames[error.agentId]}
                    </td>
                    <td className="py-2.5 text-right text-foreground tabular-nums">{formatNumber(error.occurrences)}</td>
                    <td className="py-2.5 text-right whitespace-nowrap text-muted-foreground">{formatTimeAgo(error.lastSeen)}</td>
                    <td className="py-2.5 pl-4">
                      <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", status.className)}>
                        <status.icon aria-hidden className="size-3.5" />
                        {status.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
