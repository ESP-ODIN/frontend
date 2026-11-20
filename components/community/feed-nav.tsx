"use client"

import Link from "next/link"
import { Bookmark, Sparkles, Users, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { creatorHref } from "@/lib/agents/creator"
import { CREATOR_FOLLOW_NOTE } from "@/lib/api/creator-follows"
import { FEED_TABS, type FeedTab } from "@/lib/social/feed"
import { SAVED_POSTS_NOTE } from "@/lib/social/saved"
import { UserAvatar } from "@/components/community/user-avatar"
import { DevMark } from "@/components/dev/dev-mark"

const ICONS: Record<FeedTab, LucideIcon> = {
  "for-you": Sparkles,
  following: Users,
  saved: Bookmark,
}

type FeedNavProps = {
  tab: FeedTab
  counts: Partial<Record<FeedTab, number>>
  onTabChange: (tab: FeedTab) => void
  followed: { id: string; label: string }[]
}

/** Onglets du feed : colonne collante sur desktop, barre défilante sur mobile. */
export function FeedNav({ tab, counts, onTabChange, followed }: FeedNavProps) {
  return (
    <nav aria-label="Feed" className="flex flex-col gap-6">
      <div
        role="tablist"
        className="-mx-4 flex [scrollbar-width:none] gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
      >
        {FEED_TABS.map((item) => {
          const Icon = ICONS[item.id]
          const active = tab === item.id
          const count = counts[item.id]
          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={active}
              title={item.description}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "group relative flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-foreground text-background shadow-md"
                  : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "size-4 transition-transform group-hover:scale-110",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              />
              {item.label}
              {count !== undefined && count > 0 && (
                <span
                  className={cn(
                    "ml-auto rounded-full px-1.5 font-mono text-[10px] tabular-nums",
                    active
                      ? "bg-background/15 text-background"
                      : "bg-muted/15 text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              )}
              {item.id === "saved" && (
                <DevMark kind="mock" note={SAVED_POSTS_NOTE} />
              )}
            </button>
          )
        })}
      </div>

      <div className="hidden flex-col gap-2 lg:flex">
        <p className="flex items-center gap-1.5 px-3 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          You follow <DevMark kind="mock" note={CREATOR_FOLLOW_NOTE} />
        </p>
        {followed.length === 0 ? (
          <p className="px-3 text-xs text-muted-foreground">
            Nobody yet. Follow creators from the suggestions to fill your
            timeline.
          </p>
        ) : (
          <ul className="flex flex-col">
            {followed.slice(0, 8).map((creator) => (
              <li key={creator.id}>
                <Link
                  href={creatorHref(creator.id)}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  <UserAvatar
                    seed={creator.id}
                    label={creator.label}
                    size="sm"
                  />
                  <span className="truncate">{creator.label}</span>
                </Link>
              </li>
            ))}
            {followed.length > 8 && (
              <li className="px-3 py-1 text-xs text-muted-foreground">
                +{followed.length - 8} more
              </li>
            )}
          </ul>
        )}
      </div>
    </nav>
  )
}
