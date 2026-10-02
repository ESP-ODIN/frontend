import type { AgentDetail } from "@/lib/api/agents"
import { AgentSidebarPanel } from "@/components/blocks/agent/sidebar/panel"
import { Separator } from "@/components/ui/separator"

type AgentDependenciesPanelProps = {
  detail: AgentDetail
}

export function AgentDependenciesPanel({ detail }: AgentDependenciesPanelProps) {
  return (
    <AgentSidebarPanel title={`Dependencies (${detail.dependencies.length})`}>
      <ul className="flex flex-col gap-2">
        {detail.dependencies.map((dependency) => (
          <li key={dependency} className="font-mono text-sm text-foreground/80">
            {dependency}
          <Separator className="my-2" />
          </li>
        ))}
      </ul>
    </AgentSidebarPanel>
  )
}
