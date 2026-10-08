import Link from "next/link"
import { ArrowRight, BadgeCheck, Download, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCompactCount } from "@/lib/format-count"
import { AgentIcon, type Agent } from "@/components/blocks/agent-icon"
import { Badge } from "@/components/blocks/badge"
import { SpotlightPanel } from "@/components/motion/spotlight-panel"

type AgentCardProps = {
  agent: Agent
  className?: string
}

export function AgentCard({ agent, className }: AgentCardProps) {
  return (
    <>
      <Link
        href={`/agents/${agent.id}`}
        className={cn(
          "group flex items-center gap-3 rounded-xl border border-muted/40 bg-background-100 p-3 transition-colors active:bg-muted/10 sm:hidden",
          className
        )}
      >
        <AgentIcon icon={agent.icon} name={agent.name} className="size-10 shrink-0 text-sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-mono text-sm font-bold text-foreground">{agent.name}</p>
            {agent.is_official_pick && (
              <BadgeCheck role="img" aria-label="Verified" className="size-4 shrink-0 text-primary" />
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">by {agent.creator_id}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="size-3" />
            {agent.stars}
          </span>
          <span className="font-mono">{agent.version}</span>
        </div>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </Link>

      <SpotlightPanel className={cn("hidden rounded-xl sm:block", className)}>
        <Link
          href={`/agents/${agent.id}`}
          className="group flex flex-col gap-4 rounded-xl border border-muted/40 bg-background-100 p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <AgentIcon icon={agent.icon} name={agent.name} />
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-mono text-base font-bold text-foreground">{agent.name}</p>
                  {agent.is_official_pick && (
                    <BadgeCheck role="img" aria-label="Verified" className="size-4 shrink-0 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">by {agent.creator_id}</p>
              </div>
            </div>
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
                {formatCompactCount(agent.downloads_count)}
              </span>
              <span>{agent.version}</span>
            </div>
            <span className="flex items-center gap-1 font-mono text-sm font-bold text-primary group-hover:underline">
              install
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      </SpotlightPanel>
    </>
  )
}
