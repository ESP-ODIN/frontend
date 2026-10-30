"use client"

import { useEffect, useMemo, useState } from "react"

import type { Agent } from "@/lib/agents/types"
import { countActiveFilters, emptyFilters, filterAgents, type MarketplaceFilters } from "@/lib/agents/filters"
import { searchAgents } from "@/lib/agents/search"
import { FilterBar } from "@/components/marketplace/filter-bar"
import { FilterSheet } from "@/components/marketplace/filter-sheet"
import { SpotlightCard } from "@/components/marketplace/spotlight-card"
import { SearchBar } from "@/components/marketplace/search-bar"
import { AgentGrid } from "@/components/marketplace/agent-grid"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

type MarketplaceBrowserProps = {
  agents: Agent[]
  initialQuery?: string
  initialTags?: string[]
}

/**
 * Contenu de la marketplace : filtres, spotlight, recherche et grille. La recherche est gardée
 * dans l'URL pour être partageable, sans ajouter d'entrées à l'historique.
 */
export function MarketplaceBrowser({ agents, initialQuery = "", initialTags = [] }: MarketplaceBrowserProps) {
  const [filters, setFilters] = useState<MarketplaceFilters>(emptyFilters)
  const [query, setQuery] = useState(initialQuery)
  const [tags, setTags] = useState<string[]>(initialTags)

  const filteredAgents = useMemo(
    () => searchAgents(filterAgents(agents, filters), query, tags),
    [agents, filters, query, tags]
  )
  const featuredAgents = useMemo(() => agents.filter((agent) => agent.featured), [agents])
  const activeCount = countActiveFilters(filters)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.delete("q")
    params.delete("tag")
    if (query.trim()) params.set("q", query.trim())
    for (const tag of tags) params.append("tag", tag)
    const search = params.toString()
    window.history.replaceState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}`)
  }, [query, tags])

  return (
    <div className="flex flex-col gap-10 lg:flex-row">
      <ScrollReveal className="hidden lg:flex">
        <FilterBar agents={agents} filters={filters} onChange={setFilters} />
      </ScrollReveal>
      <div className="flex min-w-0 flex-2 flex-col gap-6 sm:gap-8">
        <FilterSheet agents={agents} filters={filters} onChange={setFilters} activeCount={activeCount} />
        <SpotlightCard agents={featuredAgents} />
        <div className="flex flex-col gap-3">
          <SearchBar agents={agents} query={query} tags={tags} onQueryChange={setQuery} onTagsChange={setTags} />
          <p className="text-sm text-muted-foreground">
            {filteredAgents.length.toLocaleString("en-US")} agent{filteredAgents.length !== 1 && "s"} found
          </p>
        </div>
        <AgentGrid agents={filteredAgents} />
      </div>
    </div>
  )
}
