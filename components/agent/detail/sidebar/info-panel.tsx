import type { Agent } from "@/lib/agents/types"
import type { AgentDetail } from "@/lib/api/agents"
import { formatTimeAgo } from "@/lib/format/time-ago"
import { getRuntimeLabel } from "@/lib/publish/constants"
import { AgentSidebarPanel } from "@/components/agent/detail/sidebar/panel"
import { Separator } from "@/components/ui/separator"
import { DevMark } from "@/components/dev/dev-mark"

type AgentInfoPanelProps = {
  agent: Agent
  detail: AgentDetail
}

export function AgentInfoPanel({ agent, detail }: AgentInfoPanelProps) {
  const rows = [
    {
      label: "Version",
      value: agent.version ?? "—",
      missing: "version: agent_version exists in the DB but no endpoint exposes it",
    },
    { label: "Runtime", value: getRuntimeLabel(detail.runtime) },
    { label: "Updated", value: formatTimeAgo(detail.updated_at) },
    {
      label: "Published",
      value: new Date(detail.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    },
    { label: "Size", value: detail.sizeLabel ?? "—", missing: "size is not in the API" },
  ]

  return (
    <AgentSidebarPanel title="Information">
      <dl className="flex flex-col gap-3 [&>dd]:m-0">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col text-sm">
            <div className="flex items-center gap-4 text-sm">
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="font-mono font-medium text-foreground">{row.value}</dd>
                {row.missing && <DevMark kind="missing" note={row.missing} />}
            </div>
            <Separator className="mt-2 mb-2" />
          </div>
        ))}
      </dl>
    </AgentSidebarPanel>
  )
}
