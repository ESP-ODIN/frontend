import type { Agent } from "@/components/blocks/agent-icon"
import type { AgentDetail } from "@/lib/data/agent-details"
import { AgentSidebarPanel } from "@/components/blocks/agent/sidebar/panel"

type AgentInfoPanelProps = {
  agent: Agent
  detail: AgentDetail
}

export function AgentInfoPanel({ agent, detail }: AgentInfoPanelProps) {
  const rows = [
    { label: "Version", value: agent.version },
    { label: "Runtime", value: detail.runtimeLabel },
    { label: "Licence", value: detail.license },
    { label: "Mis à jour", value: detail.updatedLabel },
    { label: "Publié", value: detail.publishedLabel },
    { label: "Taille", value: detail.sizeLabel },
  ]

  return (
    <AgentSidebarPanel title="Informations">
      <dl className="flex flex-col gap-3 [&>dd]:m-0">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="font-mono font-medium text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </AgentSidebarPanel>
  )
}
