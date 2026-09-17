import type { Agent } from "@/components/blocks/agent-icon"
import type { AgentDetail } from "@/lib/api/agents"
import { AgentInfoPanel } from "@/components/blocks/agent/sidebar/info-panel"
import { AgentPermissionsPanel } from "@/components/blocks/agent/sidebar/permissions-panel"
import { AgentDependenciesPanel } from "@/components/blocks/agent/sidebar/dependencies-panel"
import { AgentSimilarPanel } from "@/components/blocks/agent/sidebar/similar-panel"

type AgentSidebarProps = {
  agent: Agent
  detail: AgentDetail
}

export function AgentSidebar({ agent, detail }: AgentSidebarProps) {
  return (
    <div className="flex w-full flex-col gap-6 lg:w-72 lg:shrink-0">
      <AgentInfoPanel agent={agent} detail={detail} />
      <AgentPermissionsPanel detail={detail} />
      <AgentDependenciesPanel detail={detail} />
      <AgentSimilarPanel detail={detail} />
    </div>
  )
}
