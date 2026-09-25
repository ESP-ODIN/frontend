import Link from "next/link"
import { ChevronRight, Star } from "lucide-react"

import type { AgentDetail } from "@/lib/api/agents"
import { getSimilarAgents } from "@/lib/api/agents"
import { AgentIcon } from "@/components/blocks/agent-icon"
import { AgentSidebarPanel } from "@/components/blocks/agent/sidebar/panel"

type AgentSimilarPanelProps = {
  detail: AgentDetail
}

export async function AgentSimilarPanel({ detail }: AgentSimilarPanelProps) {
  const similar = await getSimilarAgents(detail.similar)

  if (similar.length === 0) return null

  return (
    <AgentSidebarPanel title="Similar agents">
      <ul className="flex flex-col gap-3">
        {similar.map((agent) => (
          <li key={agent.slug}>
            <Link
              href={`/agents/${agent.slug}`}
              className="group flex items-center gap-3 rounded-lg -mx-1 px-1 py-1 hover:bg-accent/50"
            >
              <AgentIcon
                icon={agent.icon}
                label={agent.label}
                color={agent.color}
                className="size-8 text-xs"
              />
              <div className="flex-1">
                <p className="font-mono text-sm font-bold text-foreground">{agent.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3" />
                  {agent.stars}
                </p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </AgentSidebarPanel>
  )
}
