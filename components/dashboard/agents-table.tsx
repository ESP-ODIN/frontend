import Link from "next/link"
import { ShieldCheck, Star } from "lucide-react"

import { averageRating, sliceRange, sumBy } from "@/lib/dashboard/analytics"
import { MOCK_NOTES } from "@/lib/dashboard/mock"
import type { AgentAnalytics } from "@/lib/dashboard/types"
import { SECURE_MISSING_NOTE } from "@/lib/agents/stats"
import { formatTimeAgo } from "@/lib/format/time-ago"
import { getRuntimeLabel } from "@/lib/publish/constants"
import { AgentIcon } from "@/components/agent/agent-icon"
import { AgentTypeBadge } from "@/components/agent/agent-type-badge"
import { formatNumber } from "@/components/dashboard/charts/chart-types"
import { DevMark } from "@/components/dev/dev-mark"

type AgentsTableProps = {
  analytics: AgentAnalytics[]
  rangeDays: number
  /** Couleur de chaque agent dans les graphiques (la couleur suit l'agent partout). */
  colors: Record<string, string>
}

/** Une ligne par agent publié : données réelles de l'API + stats mockées sur la période. */
export function AgentsTable({ analytics, rangeDays, colors }: AgentsTableProps) {
  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-2xl border border-muted/40 bg-background-100 p-5">
      <div>
        <h2 className="font-semibold text-foreground">Your agents</h2>
        <p className="text-sm text-muted-foreground">Everything you published, with its numbers over the last {rangeDays} days.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-3xl text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="pb-2 font-medium">Agent</th>
              <th scope="col" className="pb-2 font-medium">Runtime</th>
              <th scope="col" className="pb-2 text-right font-medium">All-time installs</th>
              <th scope="col" className="pb-2 text-right font-medium">
                Installs ({rangeDays}d) <DevMark kind="mock" note={MOCK_NOTES.installs} />
              </th>
              <th scope="col" className="pb-2 text-right font-medium">
                Rating <DevMark kind="mock" note={MOCK_NOTES.ratings} />
              </th>
              <th scope="col" className="pb-2 text-right font-medium">
                Errors ({rangeDays}d) <DevMark kind="mock" note={MOCK_NOTES.errors} />
              </th>
              <th scope="col" className="pb-2 pl-4 font-medium">
                Security <DevMark kind="missing" note={SECURE_MISSING_NOTE} />
              </th>
              <th scope="col" className="pb-2 text-right font-medium">Updated</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {analytics.map(({ agent, daily, ratings }) => {
              const period = sliceRange(daily, rangeDays)
              const average = averageRating(ratings)
              return (
                <tr key={agent.id} className="border-t border-muted/20">
                  <td className="py-3 pr-4">
                    <Link href={`/agents/${agent.id}`} className="group/agent flex items-center gap-3">
                      <span aria-hidden className="h-6 w-0.5 shrink-0 rounded-full" style={{ background: colors[agent.id] }} />
                      <AgentIcon icon={agent.icon} name={agent.name} className="size-8 text-xs" />
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate font-mono text-sm font-bold text-foreground group-hover/agent:underline">{agent.name}</span>
                        <AgentTypeBadge type={agent.agent_type} />
                      </span>
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{getRuntimeLabel(agent.runtime)}</td>
                  <td className="py-3 text-right text-foreground">{formatNumber(agent.downloads_count)}</td>
                  <td className="py-3 text-right text-foreground">{formatNumber(sumBy(period, "installs"))}</td>
                  <td className="py-3 text-right text-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star aria-hidden className="size-3 fill-current text-muted-foreground" />
                      {average === null ? "—" : average.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 text-right text-foreground">{formatNumber(sumBy(period, "errors"))}</td>
                  <td className="py-3 pl-4">
                    {agent.secure ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        <ShieldCheck aria-hidden className="size-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not verified</span>
                    )}
                  </td>
                  <td className="py-3 text-right whitespace-nowrap text-muted-foreground">{formatTimeAgo(agent.updated_at)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
