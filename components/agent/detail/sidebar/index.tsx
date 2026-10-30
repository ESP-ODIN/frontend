import type { Agent } from "@/lib/agents/types"
import type { AgentDetail } from "@/lib/api/agents"
import { AgentInfoPanel } from "@/components/agent/detail/sidebar/info-panel"
import { AgentPermissionsPanel } from "@/components/agent/detail/sidebar/permissions-panel"
import { AgentSimilarPanel } from "@/components/agent/detail/sidebar/similar-panel"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

type AgentSidebarProps = {
  agent: Agent
  detail: AgentDetail
}

export function AgentSidebar({ agent, detail }: AgentSidebarProps) {
  return (
    <div className="flex w-full flex-col gap-6 lg:w-72 lg:shrink-0">
      <ScrollReveal delay={0}>
        <AgentInfoPanel agent={agent} detail={detail} />
      </ScrollReveal>
      <ScrollReveal delay={60}>
        <AgentPermissionsPanel detail={detail} />
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <AgentSimilarPanel agent={agent} />
      </ScrollReveal>
    </div>
  )
}
