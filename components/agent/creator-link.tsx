import Link from "next/link"

import type { Agent } from "@/lib/agents/types"
import { CREATOR_NAME_NOTE, creatorHref, creatorLabel } from "@/lib/agents/creator"
import { cn } from "@/lib/utils"
import { DevMark } from "@/components/dev/dev-mark"

type CreatorLinkProps = {
  agent: Pick<Agent, "creator_id" | "creator_username">
  className?: string
}

/**
 * "by @pseudo" vers la page publique du créateur. `relative z-10` : reste cliquable au-dessus du
 * lien étiré d'une carte agent.
 */
export function CreatorLink({ agent, className }: CreatorLinkProps) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-1", className)}>
      <span className="shrink-0">by</span>
      <Link
        href={creatorHref(agent.creator_id)}
        className="relative z-10 truncate rounded-sm font-medium text-foreground/80 underline-offset-2 transition-colors hover:text-primary hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {creatorLabel(agent)}
      </Link>
      {!agent.creator_username && <DevMark kind="missing" note={CREATOR_NAME_NOTE} className="relative z-10" />}
    </span>
  )
}
