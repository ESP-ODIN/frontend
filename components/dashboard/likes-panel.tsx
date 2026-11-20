import { ThumbsDown, ThumbsUp } from "lucide-react"

import { likeShare, sliceRange, sumBy } from "@/lib/dashboard/analytics"
import { MOCK_NOTES } from "@/lib/dashboard/mock"
import type { AgentAnalytics } from "@/lib/dashboard/types"
import { formatNumber } from "@/components/dashboard/charts/chart-types"
import { DevMark } from "@/components/dev/dev-mark"

type LikesPanelProps = {
  analytics: AgentAnalytics[]
  rangeDays: number
  /** Couleur de chaque agent dans les graphiques (la couleur suit l'agent partout). */
  colors: Record<string, string>
}

function formatShare(share: number | null) {
  return share === null ? "—" : `${Math.round(share * 100)}%`
}

/**
 * La note d'un agent, c'est ses likes : total sur la période, part de likes face aux dislikes, et
 * le détail par agent (barres fines dans la couleur de l'agent).
 */
export function LikesPanel({ analytics, rangeDays, colors }: LikesPanelProps) {
  const rows = analytics
    .map(({ agent, daily }) => {
      const period = sliceRange(daily, rangeDays)
      const likes = sumBy(period, "likes")
      const dislikes = sumBy(period, "dislikes")
      return { agent, likes, dislikes, share: likeShare(likes, dislikes) }
    })
    .sort((a, b) => b.likes - a.likes)

  const likes = rows.reduce((sum, row) => sum + row.likes, 0)
  const dislikes = rows.reduce((sum, row) => sum + row.dislikes, 0)
  const share = likeShare(likes, dislikes)
  const max = Math.max(1, ...rows.map((row) => row.likes))

  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-2xl border border-muted/40 bg-background-100 p-5">
      <div>
        <h2 className="flex items-center gap-2 font-semibold text-foreground">
          Likes <DevMark kind="mock" note={MOCK_NOTES.likes} />
        </h2>
        <p className="text-sm text-muted-foreground">How users rate your agents over the last {rangeDays} days.</p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-semibold text-foreground">{formatShare(share)}</p>
          <p className="text-sm text-muted-foreground">liked</p>
        </div>
        <div
          role="img"
          aria-label={`${formatNumber(likes)} likes and ${formatNumber(dislikes)} dislikes`}
          className="flex h-2 gap-0.5 overflow-hidden rounded-full"
        >
          {likes > 0 && <span className="h-full rounded-full bg-foreground/70" style={{ flexGrow: likes }} />}
          {dislikes > 0 && <span className="h-full rounded-full bg-muted/30" style={{ flexGrow: dislikes }} />}
          {likes + dislikes === 0 && <span className="h-full flex-1 rounded-full bg-muted/15" />}
        </div>
        <p className="flex items-center gap-4 text-xs text-muted-foreground tabular-nums">
          <span className="flex items-center gap-1">
            <ThumbsUp aria-hidden className="size-3" /> {formatNumber(likes)} likes
          </span>
          <span className="flex items-center gap-1">
            <ThumbsDown aria-hidden className="size-3" /> {formatNumber(dislikes)} dislikes
          </span>
        </p>
      </div>

      {rows.length > 1 && (
        <ul className="flex flex-col gap-2.5 border-t border-muted/30 pt-4">
          {rows.map((row) => (
            <li key={row.agent.id} className="grid grid-cols-[minmax(0,7rem)_1fr_4.5rem] items-center gap-3 text-xs">
              <span className="truncate font-mono text-foreground">{row.agent.name}</span>
              <span className="h-2 overflow-hidden rounded-full bg-muted/15">
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${(row.likes / max) * 100}%`, background: colors[row.agent.id] }}
                />
              </span>
              <span className="text-right text-muted-foreground tabular-nums">
                <span className="text-foreground">{formatNumber(row.likes)}</span> · {formatShare(row.share)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
