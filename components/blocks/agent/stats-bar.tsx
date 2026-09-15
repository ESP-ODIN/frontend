import type { AgentDetail } from "@/lib/data/agent-details"

type AgentStatsBarProps = {
  detail: AgentDetail
}

export function AgentStatsBar({ detail }: AgentStatsBarProps) {
  const stats = [
    { label: "Installations", value: detail.installsLabel },
    { label: "Stars", value: detail.starsLabel },
    { label: "Forks", value: detail.forksLabel },
    { label: "Note communauté", value: detail.ratingLabel },
    { label: "Runtime", value: detail.runtimeLabel },
    { label: "Uptime 30j", value: detail.uptimeLabel },
  ]

  return (
    <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-border/60 pt-6">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1">
          <p className="font-mono text-lg font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
