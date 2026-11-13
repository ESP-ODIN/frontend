"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Bookmark, BookmarkX, Eye, EyeOff, Search, ThumbsDown, ThumbsUp, Undo2, type LucideIcon } from "lucide-react"

import {
  followAgent,
  getAllAgentInteractions,
  likeAgent,
  saveAgent,
  unfollowAgent,
  unlikeAgent,
  unsaveAgent,
  type AgentInteractionDates,
  type AgentInteractionState,
} from "@/lib/api/agent-interactions"
import type { Agent } from "@/lib/agents/types"
import { getCategoryLabel } from "@/lib/data/categories"
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

type Shelf = {
  id: ShelfId
  label: string
  icon: LucideIcon
  empty: string
  flag: "following" | "liked" | "saved"
  dateKey: keyof AgentInteractionDates
  addedLabel: string
  remove: { label: string; icon: LucideIcon; call: (id: string) => Promise<AgentInteractionState> }
  restore: (id: string) => Promise<AgentInteractionState>
}

const INTERACTIONS_NOTE = "follows, likes and saves: stored in this browser's localStorage, no API yet"
const UNDO_DELAY_MS = 6000

const SHELVES: Shelf[] = [
  {
    id: "following",
    label: "Following",
    icon: Eye,
    empty: "Follow an agent to get its updates here.",
    flag: "following",
    dateKey: "followingAt",
    addedLabel: "Followed",
    remove: { label: "Unfollow", icon: EyeOff, call: unfollowAgent },
    restore: followAgent,
  },
  {
    id: "liked",
    label: "Liked",
    icon: ThumbsUp,
    empty: "Agents you like will show up here.",
    flag: "liked",
    dateKey: "likedAt",
    addedLabel: "Liked",
    remove: { label: "Unlike", icon: ThumbsDown, call: unlikeAgent },
    restore: likeAgent,
  },
  {
    id: "saved",
    label: "Saved",
    icon: Bookmark,
    empty: "Save agents to find them back later.",
    flag: "saved",
    dateKey: "savedAt",
    addedLabel: "Saved",
    remove: { label: "Unsave", icon: BookmarkX, call: unsaveAgent },
    restore: saveAgent,
  },
]

const SORTS: { id: SortId; label: string }[] = [
  { id: "recent", label: "Recently added" },
  { id: "name", label: "Name" },
  { id: "installs", label: "Most installed" },
]

function matches(agent: Agent, query: string) {
  if (!query) return true
  const haystack = `${agent.name} ${agent.description} ${agent.category} ${agent.runtime}`.toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word))
}

/**
 * Bibliothèque de l'utilisateur : agents suivis, likés et sauvegardés, lus dans le localStorage
 * (là où la fiche agent les enregistre). Recherche, tri, et retrait direct avec annulation.
 */
export function Library({ catalog }: LibraryProps) {
  const [interactions, setInteractions] = useState<Interactions | null>(null)
  const [shelfId, setShelfId] = useState<ShelfId>("following")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortId>("recent")
  const [removed, setRemoved] = useState<{ agent: Agent; shelf: Shelf } | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    getAllAgentInteractions().then(setInteractions)
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current)
    }
  }, [])

  const shelf = SHELVES.find((s) => s.id === shelfId)!
  const countFor = (s: Shelf) => (interactions ? catalog.filter((agent) => interactions[agent.id]?.[s.flag]).length : null)

  const addedAt = (agent: Agent) => interactions?.[agent.id]?.[shelf.dateKey]
  const agents = interactions
    ? catalog
        .filter((agent) => interactions[agent.id]?.[shelf.flag] && matches(agent, query.trim()))
        .sort((a, b) => {
          if (sort === "name") return a.name.localeCompare(b.name)
          if (sort === "installs") return b.downloads_count - a.downloads_count
          return (addedAt(b) ?? 0) - (addedAt(a) ?? 0)
        })
    : []

  async function refresh() {
    setInteractions(await getAllAgentInteractions())
  }

  async function handleRemove(agent: Agent) {
    await shelf.remove.call(agent.id)
    await refresh()
    if (undoTimer.current) clearTimeout(undoTimer.current)
    setRemoved({ agent, shelf })
    undoTimer.current = setTimeout(() => setRemoved(null), UNDO_DELAY_MS)
  }

  async function handleUndo() {
    if (!removed) return
    if (undoTimer.current) clearTimeout(undoTimer.current)
    await removed.shelf.restore(removed.agent.id)
    setRemoved(null)
    await refresh()
  }

  const total = countFor(shelf) ?? 0

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Library" className="flex flex-wrap gap-2">
          {SHELVES.map((s) => {
            const count = countFor(s)
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={shelfId === s.id}
                onClick={() => setShelfId(s.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  shelfId === s.id
                    ? "border-primary/40 bg-primary/10 font-medium text-primary"
                    : "border-muted/40 text-muted-foreground hover:border-muted/70 hover:text-foreground"
                )}
              >
                <s.icon aria-hidden className="size-3.5" />
                {s.label}
                <span className="font-mono text-xs tabular-nums opacity-70">{count ?? "·"}</span>
              </button>
            )
          })}
          <DevMark kind="mock" note={INTERACTIONS_NOTE} className="self-center" />
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
                placeholder="Search by name, category…"
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
            <span className="font-mono font-semibold text-foreground">{removed.agent.name}</span> removed from{" "}
            {removed.shelf.label.toLowerCase()}.
          </p>
          <Button variant="outline" size="sm" onClick={handleUndo}>
            <Undo2 /> Undo
          </Button>
        </div>
      )}

      {interactions === null ? null : total === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-muted/50 px-6 py-14 text-center">
          <shelf.icon aria-hidden className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground">{shelf.empty}</p>
          <Button variant="outline" render={<Link href="/marketplace" />}>
            Browse the marketplace
          </Button>
        </div>
      ) : agents.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-muted/50 px-6 py-10 text-center text-muted-foreground">
          No agent matches “{query.trim()}”.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-muted/20 overflow-hidden rounded-2xl border border-muted/40 bg-background-100">
          {agents.map((agent) => {
            const date = addedAt(agent)
            return (
              <li key={agent.id} className="group/agent flex items-center gap-3 px-4 py-3 transition-colors hover:bg-primary/5 sm:gap-4">
                <Link href={`/agents/${agent.id}`} className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                  <AgentIcon icon={agent.icon} name={agent.name} className="size-10 shrink-0 text-sm" />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-mono text-sm font-bold text-foreground group-hover/agent:underline">{agent.name}</span>
                      <AgentTypeBadge type={agent.agent_type} />
                    </span>
                    <span className="truncate text-sm text-muted-foreground">{agent.description || "No description"}</span>
                    <span className="truncate text-xs text-muted-foreground/80">
                      {getCategoryLabel(agent.category)} · {getRuntimeLabel(agent.runtime)}
                      {date ? ` · ${shelf.addedLabel} ${formatTimeAgo(new Date(date).toISOString())}` : ""}
                    </span>
                  </span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(agent)}
                  aria-label={`${shelf.remove.label} ${agent.name}`}
                  className="shrink-0 hover:border-destructive/40 hover:text-destructive"
                >
                  <shelf.remove.icon />
                  <span className="hidden sm:inline">{shelf.remove.label}</span>
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
