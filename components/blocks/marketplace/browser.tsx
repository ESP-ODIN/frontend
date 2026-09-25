"use client"

import { useMemo, useState } from "react"

import { agents } from "@/lib/data/agents"
import { emptyFilters, filterAgents, type MarketplaceFilters } from "@/lib/marketplace-filters"
import { FilterBar } from "@/components/blocks/filter-bar"
import { FilterSheet } from "@/components/blocks/marketplace/filter-sheet"
import { SpotlightCard } from "@/components/blocks/marketplace/SpotlightCard"
import { AgentGrid } from "@/components/blocks/marketplace/agent-grid"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

export function MarketplaceBrowser() {
  const [filters, setFilters] = useState<MarketplaceFilters>(emptyFilters)

  const filteredAgents = useMemo(() => filterAgents(agents, filters), [filters])
  const activeCount =
    filters.categories.length + filters.types.length + filters.languages.length + filters.updates.length

  return (
    <div className="flex flex-col gap-10 lg:flex-row">
      <ScrollReveal className="hidden lg:flex">
        <FilterBar filters={filters} onChange={setFilters} />
      </ScrollReveal>
      <div className="flex min-w-0 flex-2 flex-col gap-6 sm:gap-8">
        <FilterSheet filters={filters} onChange={setFilters} activeCount={activeCount} />
        <SpotlightCard />
        <p className="text-sm text-muted-foreground">
          {filteredAgents.length.toLocaleString("en-US")} agent{filteredAgents.length !== 1 && "s"} found
        </p>
        <AgentGrid agents={filteredAgents} />
      </div>
    </div>
  )
}
