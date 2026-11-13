import Link from "next/link"

import { AgentIcon } from "@/components/agent/agent-icon"
import { AgentTypeBadge } from "@/components/agent/agent-type-badge"
import type { Agent } from "@/lib/agents/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DevMark } from "@/components/dev/dev-mark"

type AgentListItemProps = {
  agent: Agent
  className?: string
}

export function AgentListItem({ agent, className }: AgentListItemProps) {
  return (
    <div className={cn("group group/agent flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-primary/5", className)}>
      <AgentIcon icon={agent.icon} name={agent.name} />
      <div className="flex flex-1 flex-col">
        <p className="font-mono text-sm font-bold text-foreground">{agent.name}</p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <p>
            by {agent.creator_id} <DevMark kind="missing" note="creator name: API only returns creator_id" />
          </p>
          <AgentTypeBadge type={agent.agent_type} />
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full group-hover:border-primary/40 group-hover:text-primary"
        render={<Link href={`/agents/${agent.id}`} />}
      >
        Install
      </Button>
    </div>
  )
}
