import Link from "next/link"
import { ArrowRight, Download, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { AgentIcon, type Agent } from "@/components/blocks/agent-icon"
import { Badge } from "@/components/blocks/badge"

type AgentCardProps = {
  agent: Agent
  featured?: boolean
  className?: string
}

export function AgentCard({ agent, featured = false, className }: AgentCardProps) {
  return (
    <Link
      href={`/agents/${agent.slug}`}
      className={cn(
        "group flex flex-col gap-4 rounded-xl border border-muted/40 bg-background-100 p-6 transition-colors hover:border-muted",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <AgentIcon icon={agent.icon} label={agent.label} color={agent.color} />
          <div>
            <p className="font-mono text-base font-bold text-foreground">{agent.name}</p>
            <p className="text-sm text-muted-foreground">by {agent.author}</p>
          </div>
        </div>
        {featured && (
          <Badge variant="primary" className="shrink-0">
            Featured
          </Badge>
        )}
      </div>

      <p className="text-muted-foreground">{agent.description}</p>

      <div className="flex flex-wrap gap-2">
        {agent.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-muted/40 pt-4">
        <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="size-3.5" />
            {agent.stars}
          </span>
          <span className="flex items-center gap-1">
            <Download className="size-3.5" />
            {agent.downloads}
          </span>
          <span>{agent.version}</span>
        </div>
        <span className="flex items-center gap-1 font-mono text-sm font-bold text-primary group-hover:underline">
          install
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  )
}
