"use client"

import { useMemo, useState } from "react"

import type { Agent } from "@/components/blocks/agent-icon"
import { emptyFilters, filterAgents, type MarketplaceFilters } from "@/lib/marketplace-filters"
import { FilterBar } from "@/components/blocks/filter-bar"
import { FilterSheet } from "@/components/blocks/marketplace/filter-sheet"
import { SpotlightCard } from "@/components/blocks/marketplace/SpotlightCard"
import { AgentGrid } from "@/components/blocks/marketplace/agent-grid"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

type MarketplaceBrowserProps = {
  agents: Agent[]
}

export function MarketplaceBrowser({ agents }: MarketplaceBrowserProps) {
  const [filters, setFilters] = useState<MarketplaceFilters>(emptyFilters)

  const filteredAgents = useMemo(() => filterAgents(agents, filters), [agents, filters])
  const featuredAgents = useMemo(() => agents.filter((agent) => agent.featured), [agents])
  const activeCount =
    filters.categories.length + filters.agent_types.length + filters.runtimes.length + filters.updates.length

  return (
    <div className="flex flex-col gap-10 lg:flex-row">
      <ScrollReveal className="hidden lg:flex">
        <FilterBar agents={agents} filters={filters} onChange={setFilters} />
      </ScrollReveal>
      <div className="flex min-w-0 flex-2 flex-col gap-6 sm:gap-8">
        <FilterSheet agents={agents} filters={filters} onChange={setFilters} activeCount={activeCount} />
        <SpotlightCard agents={featuredAgents} />
        <p className="text-sm text-muted-foreground">
          {filteredAgents.length.toLocaleString("en-US")} agent{filteredAgents.length !== 1 && "s"} found
        </p>
        <AgentGrid agents={filteredAgents} />
      </div>
    </div>
  )
}
