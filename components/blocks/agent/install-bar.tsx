import { Eye, GitFork, Star } from "lucide-react"

import type { Agent } from "@/components/blocks/agent-icon"
import type { AgentDetail } from "@/lib/data/agent-details"
import { Snippet } from "@/components/blocks/snippet-1"
import { Button } from "@/components/ui/button"

type AgentInstallBarProps = {
  agent: Agent
  detail: AgentDetail
}

export function AgentInstallBar({ agent, detail }: AgentInstallBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Snippet text={`odin install ${agent.name}`} dark width="fit-content" />
      <Button variant="outline" icon={Star} iconPosition="left" className="rounded-full text-foreground/70">
        Star · {detail.starsLabel}
      </Button>
      <Button variant="outline" icon={GitFork} iconPosition="left" className="rounded-full text-foreground/70">
        Fork · {detail.forksLabel}
      </Button>
      <Button variant="outline" icon={Eye} iconPosition="left" className="rounded-full text-foreground/70">
        Follow
      </Button>
    </div>
  )
}
