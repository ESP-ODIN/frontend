"use client"

import { useEffect, useMemo, useState } from "react"

import type { Agent } from "@/components/blocks/agent-icon"
import { countActiveFilters, emptyFilters, filterAgents, type MarketplaceFilters } from "@/lib/marketplace-filters"
import { searchAgents } from "@/lib/agent-search"
import { FilterBar } from "@/components/blocks/filter-bar"
import { FilterSheet } from "@/components/blocks/marketplace/filter-sheet"
import { SpotlightCard } from "@/components/blocks/marketplace/SpotlightCard"
import { SearchBar } from "@/components/blocks/marketplace/search-bar"
import { AgentGrid } from "@/components/blocks/marketplace/agent-grid"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

type MarketplaceBrowserProps = {
  agents: Agent[]
  initialQuery?: string
  initialTags?: string[]
}

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

  // Keep the search in the URL so it can be shared, without adding history entries
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
