"use client"

import { Eye, GitFork, Star } from "lucide-react"

import type { AgentDetail } from "@/lib/data/agent-details"
import { Snippet } from "@/components/blocks/snippet-1"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCount, parseCount } from "@/lib/format-count"
import { useAgentInteractions } from "@/lib/hooks/use-agent-interactions"

type AgentInstallBarProps = {
  agentSlug: string
  agentName: string
  detail: AgentDetail
}

export function AgentInstallBar({ agentSlug, agentName, detail }: AgentInstallBarProps) {
  const { starred, forked, following, toggleStar, toggleFork, toggleFollow } = useAgentInteractions(agentSlug)

  const starsCount = formatCount(parseCount(detail.starsLabel) + (starred ? 1 : 0), detail.starsLabel)
  const forksCount = formatCount(parseCount(detail.forksLabel) + (forked ? 1 : 0), detail.forksLabel)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Snippet text={`odin install ${agentName}`} dark width="fit-content" />
      <Button
        variant="outline"
        icon={Star}
        iconPosition="left"
        aria-pressed={starred}
        onClick={toggleStar}
        className={cn(
          "rounded-full text-foreground/70",
          starred && "border-primary/60 bg-primary/10 text-primary [&_svg]:fill-primary"
        )}
      >
        Star · {starsCount}
      </Button>
      <Button
        variant="outline"
        icon={GitFork}
        iconPosition="left"
        aria-pressed={forked}
        onClick={toggleFork}
        className={cn(
          "rounded-full text-foreground/70",
          forked && "border-primary/60 bg-primary/10 text-primary"
        )}
      >
        Fork · {forksCount}
      </Button>
      <Button
        variant="outline"
        icon={Eye}
        iconPosition="left"
        aria-pressed={following}
        onClick={toggleFollow}
        className={cn(
          "rounded-full text-foreground/70",
          following && "border-primary/60 bg-primary/10 text-primary"
        )}
      >
        {following ? "Suivi" : "Follow"}
      </Button>
    </div>
  )
}
