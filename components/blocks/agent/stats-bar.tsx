import type { AgentDetail } from "@/lib/api/agents"
import { formatCompactCount } from "@/lib/format-count"
import { getRuntimeLabel } from "@/lib/publish/constants"

type AgentStatsBarProps = {
  detail: AgentDetail
}

export function AgentStatsBar({ detail }: AgentStatsBarProps) {
  const stats = [
    { label: "Installs", value: formatCompactCount(detail.downloads_count) },
    { label: "Stars", value: detail.starsLabel ?? "—" },
    { label: "Forks", value: detail.forksLabel ?? "—" },
    { label: "Community rating", value: detail.ratingLabel ?? "—" },
    { label: "Runtime", value: getRuntimeLabel(detail.runtime) },
    { label: "Security tests passed", value: detail.uptimeLabel ?? "—" },
  ]

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-4 border-t border-border/60 pt-6 sm:gap-x-10">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1">
          <p className="font-mono text-lg font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
