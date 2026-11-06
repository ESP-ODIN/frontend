import Link from "next/link"
import { ArrowRight, BadgeCheck, Bookmark, Download, Eye, ThumbsUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatCompactCount } from "@/lib/format/count"
import { limitTags } from "@/lib/agents/tags"
import { AgentIcon } from "@/components/agent/agent-icon"
import type { Agent } from "@/lib/agents/types"
import { Badge } from "@/components/ui/badge"
import { SpotlightPanel } from "@/components/motion/spotlight-panel"
import { DevMark } from "@/components/dev/dev-mark"

const CREATOR_NOTE = "creator name: API only returns creator_id"
const COUNTERS_NOTE = "likes, saves, followers and version are not in the API"

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
          <p className="truncate text-xs text-muted-foreground">
            by {agent.creator_id} <DevMark kind="missing" note={CREATOR_NOTE} />
          </p>
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
            <span className="flex items-center gap-1" title="Followers">
              <Eye className="size-3" />
              {agent.followers ?? "0"}
            </span>
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <DevMark kind="missing" note={COUNTERS_NOTE} />
            {agent.version ?? "—"}
          </span>
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
                <p className="text-sm text-muted-foreground">
                  by {agent.creator_id} <DevMark kind="missing" note={CREATOR_NOTE} />
                </p>
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
            <DevMark kind="missing" note="tags: no tags column in the DB" className="self-center" />
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
              <span className="flex items-center gap-1" title="Followers">
                <Eye className="size-3.5" />
                {agent.followers ?? "0"}
              </span>
              <span className="flex items-center gap-1">
                <Download className="size-3.5" />
                {formatCompactCount(agent.downloads_count)}
              </span>
              <span>{agent.version ?? "—"}</span>
              <DevMark kind="missing" note={COUNTERS_NOTE} />
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
