import { AgentIcon, type Agent } from "@/components/blocks/agent-icon"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AgentListItemProps = {
  agent: Agent
  className?: string
}

export function AgentListItem({ agent, className }: AgentListItemProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-lg p-2", className)}>
      <AgentIcon icon={agent.icon} label={agent.label} color={agent.color} />
      <div className="flex flex-1 flex-col">
        <p className="font-mono text-sm font-bold text-foreground">{agent.name}</p>
        <p className="text-xs text-muted-foreground">by {agent.author}</p>
      </div>
      <Button variant="outline" size="sm" className="rounded-full">
        Install
      </Button>
    </div>
  )
}
