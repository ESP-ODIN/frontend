"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { Bookmark, BookmarkX, Search, ThumbsDown, ThumbsUp, Undo2, User, UserMinus, Users, type LucideIcon } from "lucide-react"

import {
  getAllAgentInteractions,
  likeAgent,
  saveAgent,
  unlikeAgent,
  unsaveAgent,
  type AgentInteractionDates,
  type AgentInteractionState,
} from "@/lib/api/agent-interactions"
import { CREATOR_FOLLOW_NOTE, followCreator, getFollowedCreators, unfollowCreator, type FollowedCreators } from "@/lib/api/creator-follows"
import type { Agent } from "@/lib/agents/types"
import { collectCreators, creatorDisplayName, creatorHref, type Creator } from "@/lib/agents/creator"
import { scoreCreator, tokenize } from "@/lib/agents/search"
import { getCategoryLabel } from "@/lib/data/categories"
import { formatCompactCount } from "@/lib/format/count"
import { formatTimeAgo } from "@/lib/format/time-ago"
import { getRuntimeLabel } from "@/lib/publish/constants"
import { cn } from "@/lib/utils"
import { AgentIcon } from "@/components/agent/agent-icon"
import { AgentTypeBadge } from "@/components/agent/agent-type-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DevMark } from "@/components/dev/dev-mark"

type LibraryProps = {
  catalog: Agent[]
}

type ShelfId = "following" | "liked" | "saved"
type SortId = "recent" | "name" | "installs"
type Interactions = Record<string, AgentInteractionState & AgentInteractionDates>

/** Une ligne de la bibliothèque, qu'elle représente un créateur ou un agent. */
type Row = {
  id: string
  href: string
  name: string
  installs: number
  addedAt?: number
  icon: ReactNode
  title: ReactNode
  subtitle: string
  meta: string
}

type Shelf = {
  id: ShelfId
  label: string
  icon: LucideIcon
  empty: string
  emptyCta: { label: string; href: string }
  addedLabel: string
  searchPlaceholder: string
  note: string
  remove: { label: string; icon: LucideIcon }
}

const AGENT_INTERACTIONS_NOTE = "likes and saves: stored in this browser's localStorage, no API yet"
const UNDO_DELAY_MS = 6000

const SHELVES: Shelf[] = [
  {
    id: "following",
    label: "Following",
    icon: Users,
    empty: "Follow creators to keep up with the agents they publish.",
    emptyCta: { label: "Find creators", href: "/marketplace" },
    addedLabel: "Followed",
    searchPlaceholder: "Search creators…",
    note: CREATOR_FOLLOW_NOTE,
    remove: { label: "Unfollow", icon: UserMinus },
  },
  {
    id: "liked",
    label: "Liked",
    icon: ThumbsUp,
    empty: "Agents you like will show up here.",
    emptyCta: { label: "Browse the marketplace", href: "/marketplace" },
    addedLabel: "Liked",
    searchPlaceholder: "Search by name, category…",
    note: AGENT_INTERACTIONS_NOTE,
    remove: { label: "Unlike", icon: ThumbsDown },
  },
  {
    id: "saved",
    label: "Saved",
    icon: Bookmark,
    empty: "Save agents to find them back later.",
    emptyCta: { label: "Browse the marketplace", href: "/marketplace" },
    addedLabel: "Saved",
    searchPlaceholder: "Search by name, category…",
    note: AGENT_INTERACTIONS_NOTE,
    remove: { label: "Unsave", icon: BookmarkX },
  },
]

const SORTS: { id: SortId; label: string }[] = [
  { id: "recent", label: "Recently added" },
  { id: "name", label: "Name" },
  { id: "installs", label: "Most installed" },
]

function agentMatches(agent: Agent, query: string) {
  if (!query) return true
  const haystack = `${agent.name} ${agent.description} ${agent.category} ${agent.runtime}`.toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word))
}

function creatorMatches(creator: Creator, query: string) {
  const tokens = tokenize(query.replace(/^@/, ""))
  return tokens.length === 0 || scoreCreator(creator, tokens) > 0
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`
}

function creatorRow(creator: Creator, followedAt: number): Row {
  return {
    id: creator.id,
    href: creatorHref(creator.id),
    name: creatorDisplayName(creator),
    installs: creator.installs,
    addedAt: followedAt,
    icon: (
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-orange-400 text-primary-foreground">
        <User className="size-4" />
      </span>
    ),
    title: <span className="truncate font-mono text-sm font-bold text-foreground group-hover/agent:underline">{creatorDisplayName(creator)}</span>,
    subtitle: creator.name ?? (creator.agentCount > 0 ? `${plural(creator.agentCount, "agent")} published` : "No agent published yet"),
    meta: `${formatCompactCount(creator.installs)} installs · Followed ${formatTimeAgo(new Date(followedAt).toISOString())}`,
  }
}

function agentRow(agent: Agent, addedLabel: string, addedAt?: number): Row {
  return {
    id: agent.id,
    href: `/agents/${agent.id}`,
    name: agent.name,
    installs: agent.downloads_count,
    addedAt,
    icon: <AgentIcon icon={agent.icon} name={agent.name} className="size-10 shrink-0 text-sm" />,
    title: (
      <>
        <span className="truncate font-mono text-sm font-bold text-foreground group-hover/agent:underline">{agent.name}</span>
        <AgentTypeBadge type={agent.agent_type} />
      </>
    ),
    subtitle: agent.description || "No description",
    meta: `${getCategoryLabel(agent.category)} · ${getRuntimeLabel(agent.runtime)}${
      addedAt ? ` · ${addedLabel} ${formatTimeAgo(new Date(addedAt).toISOString())}` : ""
    }`,
  }
}

/**
 * Bibliothèque de l'utilisateur : créateurs suivis, agents likés et sauvegardés, lus dans le
 * localStorage (là où la fiche agent et la page créateur les enregistrent). Recherche, tri, et
 * retrait direct avec annulation.
 */
export function Library({ catalog }: LibraryProps) {
  const [interactions, setInteractions] = useState<Interactions | null>(null)
  const [follows, setFollows] = useState<FollowedCreators | null>(null)
  const [shelfId, setShelfId] = useState<ShelfId>("following")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortId>("recent")
  const [removed, setRemoved] = useState<{ id: string; name: string; shelf: Shelf } | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function refresh() {
    const [nextInteractions, nextFollows] = await Promise.all([getAllAgentInteractions(), getFollowedCreators()])
    setInteractions(nextInteractions)
    setFollows(nextFollows)
  }

  useEffect(() => {
    refresh()
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current)
    }
  }, [])

  const shelf = SHELVES.find((s) => s.id === shelfId)!
  const loaded = interactions !== null && follows !== null

  // Un créateur suivi sans agent au catalogue reste listé, avec son id.
  const creators = new Map(collectCreators(catalog).map((creator) => [creator.id, creator]))
  const creatorFor = (id: string): Creator => creators.get(id) ?? { id, agentCount: 0, installs: 0 }

  const allRows: Record<ShelfId, Row[]> = { following: [], liked: [], saved: [] }
  const matchingRows: Record<ShelfId, Row[]> = { following: [], liked: [], saved: [] }
  if (loaded) {
    const q = query.trim()
    for (const [id, followedAt] of Object.entries(follows)) {
      const creator = creatorFor(id)
      const row = creatorRow(creator, followedAt)
      allRows.following.push(row)
      if (creatorMatches(creator, q)) matchingRows.following.push(row)
    }
    for (const agent of catalog) {
      const state = interactions[agent.id]
      if (state?.liked) {
        const row = agentRow(agent, "Liked", state.likedAt)
        allRows.liked.push(row)
        if (agentMatches(agent, q)) matchingRows.liked.push(row)
      }
      if (state?.saved) {
        const row = agentRow(agent, "Saved", state.savedAt)
        allRows.saved.push(row)
        if (agentMatches(agent, q)) matchingRows.saved.push(row)
      }
    }
  }

  const rows = [...matchingRows[shelf.id]].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name)
    if (sort === "installs") return b.installs - a.installs
    return (b.addedAt ?? 0) - (a.addedAt ?? 0)
  })
  const total = allRows[shelf.id].length

  async function removeFrom(target: Shelf, id: string) {
    if (target.id === "following") await unfollowCreator(id)
    else if (target.id === "liked") await unlikeAgent(id)
    else await unsaveAgent(id)
  }

  async function restoreTo(target: Shelf, id: string) {
    if (target.id === "following") await followCreator(id)
    else if (target.id === "liked") await likeAgent(id)
    else await saveAgent(id)
  }

  async function handleRemove(row: Row) {
    await removeFrom(shelf, row.id)
    await refresh()
    if (undoTimer.current) clearTimeout(undoTimer.current)
    setRemoved({ id: row.id, name: row.name, shelf })
    undoTimer.current = setTimeout(() => setRemoved(null), UNDO_DELAY_MS)
  }

  async function handleUndo() {
    if (!removed) return
    if (undoTimer.current) clearTimeout(undoTimer.current)
    await restoreTo(removed.shelf, removed.id)
    setRemoved(null)
    await refresh()
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Library" className="flex flex-wrap gap-2">
          {SHELVES.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={shelfId === s.id}
              onClick={() => {
                setShelfId(s.id)
                setQuery("")
              }}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                shelfId === s.id
                  ? "border-primary/40 bg-primary/10 font-medium text-primary"
                  : "border-muted/40 text-muted-foreground hover:border-muted/70 hover:text-foreground"
              )}
            >
              <s.icon aria-hidden className="size-3.5" />
              {s.label}
              <span className="font-mono text-xs tabular-nums opacity-70">{loaded ? allRows[s.id].length : "·"}</span>
            </button>
          ))}
          <DevMark kind="mock" note={shelf.note} className="self-center" />
        </div>

        {total > 0 && (
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <label className="relative flex-1 sm:w-64 sm:flex-none">
              <span className="sr-only">Search in {shelf.label.toLowerCase()}</span>
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="library-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={shelf.searchPlaceholder}
                className="pl-9"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="sr-only sm:not-sr-only">Sort</span>
              <select
                id="library-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortId)}
                className="h-9 rounded-4xl border border-input bg-input/30 px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {SORTS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      {removed && (
        <div
          role="status"
          className="flex animate-in items-center justify-between gap-3 rounded-xl border border-muted/40 bg-background-100 px-4 py-2.5 text-sm fade-in-0 slide-in-from-top-1"
        >
          <p className="min-w-0 truncate text-muted-foreground">
            <span className="font-mono font-semibold text-foreground">{removed.name}</span> removed from{" "}
            {removed.shelf.label.toLowerCase()}.
          </p>
          <Button variant="outline" size="sm" onClick={handleUndo}>
            <Undo2 /> Undo
          </Button>
        </div>
      )}

      {!loaded ? null : total === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-muted/50 px-6 py-14 text-center">
          <shelf.icon aria-hidden className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground">{shelf.empty}</p>
          <Button variant="outline" render={<Link href={shelf.emptyCta.href} />}>
            {shelf.emptyCta.label}
          </Button>
        </div>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-muted/50 px-6 py-10 text-center text-muted-foreground">
          Nothing matches “{query.trim()}”.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-muted/20 overflow-hidden rounded-2xl border border-muted/40 bg-background-100">
          {rows.map((row) => (
            <li key={row.id} className="group/agent flex items-center gap-3 px-4 py-3 transition-colors hover:bg-primary/5 sm:gap-4">
              <Link href={row.href} className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                {row.icon}
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex items-center gap-2">{row.title}</span>
                  <span className="truncate text-sm text-muted-foreground">{row.subtitle}</span>
                  <span className="truncate text-xs text-muted-foreground/80">{row.meta}</span>
                </span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemove(row)}
                aria-label={`${shelf.remove.label} ${row.name}`}
                className="shrink-0 hover:border-destructive/40 hover:text-destructive"
              >
                <shelf.remove.icon />
                <span className="hidden sm:inline">{shelf.remove.label}</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
