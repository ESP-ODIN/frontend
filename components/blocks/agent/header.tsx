import type { Agent } from "@/components/blocks/agent-icon"
import type { AgentDetail } from "@/lib/api/agents"
import { AgentIcon } from "@/components/blocks/agent-icon"
import { Badge } from "@/components/blocks/badge"

type AgentHeaderProps = {
  agent: Agent
  detail: AgentDetail
}

export function AgentHeader({ agent, detail }: AgentHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      <AgentIcon icon={agent.icon} label={agent.label} color={agent.color} className="size-14 text-xl" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="font-mono text-3xl font-bold text-foreground">{agent.name}</h1>
          <Badge variant="outline">{agent.version}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          par <span className="text-primary">{agent.author}</span> · mis à jour{" "}
          {detail.updatedLabel} · {detail.categoryLabel}
        </p>
        <p className="max-w-2xl text-foreground/80">{agent.description}</p>
      </div>
    </div>
  )
}
