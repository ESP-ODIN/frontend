"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bookmark, Eye, ThumbsUp, type LucideIcon } from "lucide-react"

import { getAllAgentInteractions, type AgentInteractionState } from "@/lib/api/agent-interactions"
import type { Agent } from "@/lib/agents/types"
import { cn } from "@/lib/utils"
import { AgentCard } from "@/components/agent/agent-card"
import { Button } from "@/components/ui/button"
import { DevMark } from "@/components/dev/dev-mark"

type LibraryProps = {
  catalog: Agent[]
}

type ShelfId = "following" | "liked" | "saved"

const INTERACTIONS_NOTE = "follows, likes and saves: stored in this browser's localStorage, no API yet"

const SHELVES: { id: ShelfId; label: string; icon: LucideIcon; empty: string; key: keyof AgentInteractionState }[] = [
  { id: "following", label: "Following", icon: Eye, empty: "Follow an agent to get its updates here.", key: "following" },
  { id: "liked", label: "Liked", icon: ThumbsUp, empty: "Agents you like will show up here.", key: "liked" },
  { id: "saved", label: "Saved", icon: Bookmark, empty: "Save agents to find them back later.", key: "saved" },
]

/**
 * Bibliothèque de l'utilisateur : agents suivis, likés et sauvegardés, lus dans le localStorage
 * (là où la fiche agent les enregistre). Une étagère visible à la fois.
 */
export function Library({ catalog }: LibraryProps) {
  const [interactions, setInteractions] = useState<Record<string, AgentInteractionState> | null>(null)
  const [shelf, setShelf] = useState<ShelfId>("following")

  useEffect(() => {
    getAllAgentInteractions().then(setInteractions)
  }, [])

  const lists: Record<ShelfId, Agent[]> = { following: [], liked: [], saved: [] }
  for (const s of SHELVES) {
    if (interactions) lists[s.id] = catalog.filter((agent) => interactions[agent.id]?.[s.key])
  }

  const current = SHELVES.find((s) => s.id === shelf)!
  const agents = lists[shelf]
  const loading = interactions === null

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Library" className="flex flex-wrap gap-2">
        {SHELVES.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={shelf === s.id}
            onClick={() => setShelf(s.id)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              shelf === s.id
                ? "border-primary/40 bg-primary/10 font-medium text-primary"
                : "border-muted/40 text-muted-foreground hover:border-muted/70 hover:text-foreground"
            )}
          >
            <s.icon aria-hidden className="size-3.5" />
            {s.label}
            <span className="font-mono text-xs tabular-nums opacity-70">
              {interactions === null ? "·" : lists[s.id].length}
            </span>
          </button>
        ))}
        <DevMark kind="mock" note={INTERACTIONS_NOTE} className="self-center" />
      </div>

      {loading ? null : agents.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-muted/50 px-6 py-14 text-center">
          <current.icon aria-hidden className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground">{current.empty}</p>
          <Button variant="outline" render={<Link href="/marketplace" />}>
            Browse the marketplace
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  )
}
