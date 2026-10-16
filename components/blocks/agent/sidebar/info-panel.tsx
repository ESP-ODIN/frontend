import type { Agent } from "@/components/blocks/agent-icon"
import type { AgentDetail } from "@/lib/api/agents"
import { formatTimeAgo } from "@/lib/format-time-ago"
import { getRuntimeLabel } from "@/lib/publish/constants"
import { AgentSidebarPanel } from "@/components/blocks/agent/sidebar/panel"
import { Separator } from "@/components/ui/separator"

type AgentInfoPanelProps = {
  agent: Agent
  detail: AgentDetail
}

export function AgentInfoPanel({ agent, detail }: AgentInfoPanelProps) {
  const rows = [
    { label: "Version", value: agent.version ?? "—" },
    { label: "Runtime", value: getRuntimeLabel(detail.runtime) },
    { label: "License", value: detail.license ?? "—" },
    { label: "Updated", value: formatTimeAgo(detail.updated_at) },
    {
      label: "Published",
      value: new Date(detail.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    },
    { label: "Size", value: detail.sizeLabel ?? "—" },
  ]

  return (
    <AgentSidebarPanel title="Information">
      <dl className="flex flex-col gap-3 [&>dd]:m-0">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col text-sm">
            <div className="flex items-center gap-4 text-sm">
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="font-mono font-medium text-foreground">{row.value}</dd>
            </div>
            <Separator className="mt-2 mb-2" />
          </div>
        ))}
      </dl>
    </AgentSidebarPanel>
  )
}
