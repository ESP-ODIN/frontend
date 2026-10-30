import type { AgentDetail } from "@/lib/api/agents"
import { formatCompactCount } from "@/lib/format-count"
import { getRuntimeLabel } from "@/lib/publish/constants"
import { DevMark } from "@/components/dev/dev-mark"

type AgentStatsBarProps = {
  detail: AgentDetail
}

export function AgentStatsBar({ detail }: AgentStatsBarProps) {
  const stats = [
    {
      label: "Installs",
      value: formatCompactCount(detail.downloads_count),
      missing: "GET /catalog/agents/:id doesn't select downloads_count, always 0",
    },
    { label: "Likes", value: detail.likesLabel ?? "—", missing: "likes are not in the API" },
    { label: "Saves", value: detail.savesLabel ?? "—", missing: "saves are not in the API" },
    { label: "Runtime", value: getRuntimeLabel(detail.runtime) },
    {
      label: "Security tests passed",
      value: detail.uptimeLabel ?? "—",
      missing: "no security results in the API",
    },
  ]

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-4 border-t border-border/60 pt-6 sm:gap-x-10">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1">
          <p className="font-mono text-lg font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground">
            {stat.label} {stat.missing && <DevMark kind="missing" note={stat.missing} />}
          </p>
        </div>
      ))}
    </div>
  )
}
