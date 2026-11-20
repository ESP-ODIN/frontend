"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowUpRight, Download, TrendingUp } from "lucide-react"

import type { Agent } from "@/lib/agents/types"
import { cn } from "@/lib/utils"
import {
  creatorDisplayName,
  creatorHref,
  type Creator,
} from "@/lib/agents/creator"
import { formatCompactCount } from "@/lib/format/count"
import { formatTimeAgo } from "@/lib/format/time-ago"
import { AgentIcon } from "@/components/agent/agent-icon"
import { FollowCreatorButton } from "@/components/creator/follow-creator-button"
import { UserAvatar } from "@/components/community/user-avatar"

function Panel({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-muted/30 bg-background-100 p-4",
        className
      )}
    >
      <h2 className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}

type FeedSidebarProps = {
  popularAgents: Agent[]
  newAgents: Agent[]
  suggestedCreators: Creator[]
  tags: { tag: string; count: number }[]
  activeTag: string | null
  onTagClick: (tag: string) => void
  isLoggedIn: boolean
  /** Appelé après un clic sur Suivre : le feed se recharge avec ce créateur. */
  onFollowChange: () => void
}

export function FeedSidebar({
  popularAgents,
  newAgents,
  suggestedCreators,
  tags,
  activeTag,
  onTagClick,
  isLoggedIn,
  onFollowChange,
}: FeedSidebarProps) {
  return (
    <aside className="flex flex-col gap-4">
      {popularAgents.length > 0 && (
        <Panel title="Popular agents">
          <ol className="flex flex-col">
            {popularAgents.map((agent, i) => (
              <li key={agent.id}>
                <Link
                  href={`/agents/${agent.id}`}
                  className="group flex items-center gap-3 rounded-lg py-1.5 transition-colors"
                >
                  <span className="w-3 font-mono text-[11px] text-muted-foreground">
                    {i + 1}
                  </span>
                  <AgentIcon name={agent.name} className="size-7 rounded-lg" />
                  <span className="min-w-0 flex-1 truncate font-mono text-sm text-foreground transition-colors group-hover:text-primary">
                    {agent.name}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                    <Download className="size-3" />
                    {formatCompactCount(agent.downloads_count)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Panel>
      )}

      {tags.length > 0 && (
        <Panel title="Popular tags">
          <div className="flex flex-wrap gap-1.5">
            {tags.map(({ tag, count }) => (
              <button
                key={tag}
                type="button"
                aria-pressed={activeTag === tag}
                onClick={() => onTagClick(tag)}
                className={cn(
                  "group inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[11px] transition-all active:scale-95",
                  activeTag === tag
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted/30 text-foreground/70 hover:border-primary/40 hover:text-primary"
                )}
              >
                #{tag}
                <span
                  className={cn(
                    "text-[10px]",
                    activeTag === tag
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        </Panel>
      )}

      {suggestedCreators.length > 0 && (
        <Panel title="Creators to follow">
          <ul
            className="flex flex-col divide-y divide-muted/20"
            onClickCapture={() => setTimeout(onFollowChange, 60)}
          >
            {suggestedCreators.map((creator) => {
              const label = creator.name || creatorDisplayName(creator)
              return (
                <li
                  key={creator.id}
                  className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <Link
                    href={creatorHref(creator.id)}
                    className="flex min-w-0 flex-1 items-center gap-2.5"
                  >
                    <UserAvatar seed={creator.id} label={label} />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-semibold text-foreground hover:text-primary">
                        {label}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {creator.agentCount} agent
                        {creator.agentCount === 1 ? "" : "s"} ·{" "}
                        {formatCompactCount(creator.installs)} installs
                      </span>
                    </span>
                  </Link>
                  <FollowCreatorButton
                    creatorId={creator.id}
                    isLoggedIn={isLoggedIn}
                    size="compact"
                  />
                </li>
              )
            })}
          </ul>
        </Panel>
      )}

      {newAgents.length > 0 && (
        <Panel title="New this week">
          <ul className="flex flex-col">
            {newAgents.map((agent) => (
              <li key={agent.id}>
                <Link
                  href={`/agents/${agent.id}`}
                  className="group flex items-center justify-between gap-2 rounded-lg py-1.5"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-mono text-sm text-foreground">
                      {agent.name}
                    </span>
                    {agent.created_at && (
                      <span className="text-[11px] text-muted-foreground">
                        {formatTimeAgo(agent.created_at)}
                      </span>
                    )}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-0.5 font-mono text-xs text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    install <ArrowUpRight className="size-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <p className="flex items-center gap-1.5 px-2 text-[11px] text-muted-foreground">
        <TrendingUp className="size-3" /> Agents and creators come live from the
        marketplace.
      </p>
    </aside>
  )
}
