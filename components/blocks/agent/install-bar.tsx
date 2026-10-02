"use client"

import { Eye, GitFork, Star } from "lucide-react"

import type { AgentDetail } from "@/lib/api/agents"
import { Snippet } from "@/components/blocks/snippet-1"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCount, parseCount } from "@/lib/format-count"
import { useAgentInteractions } from "@/lib/hooks/use-agent-interactions"
import { useExplosion } from "@/components/motion/explosion-burst"

type AgentInstallBarProps = {
  agentSlug: string
  agentName: string
  detail: AgentDetail
}

const FOLLOW_COLORS = ["#60a5fa", "#93c5fd", "#bfdbfe", "#e85d04", "#ffb35c"]

export function AgentInstallBar({ agentSlug, agentName, detail }: AgentInstallBarProps) {
  const { starred, forked, following, toggleStar, toggleFork, toggleFollow } = useAgentInteractions(agentSlug)
  const star = useExplosion<HTMLSpanElement>()
  const fork = useExplosion<HTMLSpanElement>()
  const follow = useExplosion<HTMLSpanElement>()

  const starsCount = formatCount(parseCount(detail.starsLabel) + (starred ? 1 : 0), detail.starsLabel)
  const forksCount = formatCount(parseCount(detail.forksLabel) + (forked ? 1 : 0), detail.forksLabel)

  function handleStar() {
    star.explode(starred ? { mode: "implode" } : {})
    toggleStar()
  }

  function handleFork() {
    fork.explode(forked ? { mode: "implode" } : {})
    toggleFork()
  }

  function handleFollow() {
    follow.explode(following ? { mode: "implode" } : { colors: FOLLOW_COLORS })
    toggleFollow()
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Snippet text={`odin install ${agentName}`} dark width="fit-content" />
      <span ref={star.containerRef} className="relative inline-flex">
        <Button
          variant="outline"
          icon={Star}
          iconPosition="left"
          aria-pressed={starred}
          onClick={handleStar}
          className={cn(
            "rounded-full text-foreground/70",
            starred && "border-primary/60 bg-primary/10 text-primary [&_svg]:fill-primary"
          )}
        >
          Star · {starsCount}
        </Button>
      </span>
      <span ref={fork.containerRef} className="relative inline-flex">
        <Button
          variant="outline"
          icon={GitFork}
          iconPosition="left"
          aria-pressed={forked}
          onClick={handleFork}
          className={cn(
            "rounded-full text-foreground/70",
            forked && "border-primary/60 bg-primary/10 text-primary"
          )}
        >
          Fork · {forksCount}
        </Button>
      </span>
      <span ref={follow.containerRef} className="relative inline-flex">
        <Button
          variant="outline"
          icon={Eye}
          iconPosition="left"
          aria-pressed={following}
          onClick={handleFollow}
          className={cn(
            "rounded-full text-foreground/70",
            following && "border-primary/60 bg-primary/10 text-primary"
          )}
        >
          {following ? "Following" : "Follow"}
        </Button>
      </span>
    </div>
  )
}
