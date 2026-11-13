import Link from "next/link"
import { ArrowRight, BadgeCheck, Bookmark, Download, ThumbsUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCompactCount } from "@/lib/format/count"
import { limitTags } from "@/lib/agents/tags"
import { AgentIcon } from "@/components/agent/agent-icon"
import { AgentTypeBadge } from "@/components/agent/agent-type-badge"
import { CreatorLink } from "@/components/agent/creator-link"
import type { Agent } from "@/lib/agents/types"
import { Badge } from "@/components/ui/badge"
import { SpotlightPanel } from "@/components/motion/spotlight-panel"
import { DevMark } from "@/components/dev/dev-mark"

const COUNTERS_NOTE = "likes, saves and version are not in the API"

/**
 * Lien principal étiré sur toute la carte (pseudo-élément ::after en inset-0) : la carte entière
 * mène à l'agent, et les liens placés en `relative z-10` (créateur, DevMark) restent cliquables
 * par-dessus sans imbriquer de <a>.
 */
const STRETCHED_LINK = "outline-none after:absolute after:inset-0 after:rounded-xl after:content-['']"
const CARD_FOCUS = "has-[a[data-card-link]:focus-visible]:ring-[3px] has-[a[data-card-link]:focus-visible]:ring-ring/50"

type AgentCardProps = {
  agent: Agent
  className?: string
  /** Désactive le dépliage du type au survol (landing). */
  staticType?: boolean
}

export function AgentCard({ agent, className, staticType = false }: AgentCardProps) {
  const href = `/agents/${agent.id}`

  return (
    <>
      <div
        className={cn(
          "group group/agent relative flex items-center gap-3 rounded-xl border border-muted/40 bg-background-100 p-3 transition-colors active:bg-muted/10 sm:hidden",
          CARD_FOCUS,
          className
        )}
      >
        <AgentIcon icon={agent.icon} name={agent.name} className="size-10 shrink-0 text-sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Link href={href} data-card-link className={cn("truncate font-mono text-sm font-bold text-foreground", STRETCHED_LINK)}>
              {agent.name}
            </Link>
            {agent.is_official_pick && (
              <BadgeCheck role="img" aria-label="Verified" className="size-4 shrink-0 text-primary" />
            )}
          </div>
          <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <CreatorLink agent={agent} />
            <AgentTypeBadge interactive={!staticType} type={agent.agent_type} />
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="flex items-center gap-1" title="Likes">
              <ThumbsUp className="size-3" />
              {agent.likes ?? "0"}
            </span>
            <span className="flex items-center gap-1" title="Saves">
              <Bookmark className="size-3" />
              {agent.saves ?? "0"}
            </span>
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <DevMark kind="missing" note={COUNTERS_NOTE} className="relative z-10" />
            {agent.version ?? "—"}
          </span>
        </div>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>

      <SpotlightPanel className={cn("hidden rounded-xl sm:block", className)}>
        <div
          className={cn(
            "group group/agent relative flex flex-col gap-4 rounded-xl border border-muted/40 bg-background-100 p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
            CARD_FOCUS
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <AgentIcon icon={agent.icon} name={agent.name} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Link href={href} data-card-link className={cn("font-mono text-base font-bold text-foreground", STRETCHED_LINK)}>
                    {agent.name}
                  </Link>
                  {agent.is_official_pick && (
                    <BadgeCheck role="img" aria-label="Verified" className="size-4 shrink-0 text-primary" />
                  )}
                </div>
                <CreatorLink agent={agent} className="flex text-sm text-muted-foreground" />
              </div>
            </div>
          </div>

          <p className="text-muted-foreground">{agent.description}</p>

          <div className="flex flex-wrap gap-2">
            {agent.tags?.length ? (
              limitTags(agent.tags).map((tag) => <Badge key={tag}>{tag}</Badge>)
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
            <DevMark kind="missing" note="tags: no tags column in the DB" className="relative z-10 self-center" />
            <AgentTypeBadge interactive={!staticType} type={agent.agent_type} className="ml-auto self-center" />
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-muted/40 pt-4">
            <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
              <span className="flex items-center gap-1" title="Likes">
                <ThumbsUp className="size-3.5" />
                {agent.likes ?? "0"}
              </span>
              <span className="flex items-center gap-1" title="Saves">
                <Bookmark className="size-3.5" />
                {agent.saves ?? "0"}
              </span>
              <span className="flex items-center gap-1">
                <Download className="size-3.5" />
                {formatCompactCount(agent.downloads_count)}
              </span>
              <span>{agent.version ?? "—"}</span>
              <DevMark kind="missing" note={COUNTERS_NOTE} className="relative z-10" />
            </div>
            <span aria-hidden className="flex items-center gap-1 font-mono text-sm font-bold text-primary group-hover:underline">
              install
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </SpotlightPanel>
    </>
  )
}
