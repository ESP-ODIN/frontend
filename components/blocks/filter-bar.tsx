import { Check, type LucideIcon } from "lucide-react"

import type { Agent } from "@/components/blocks/agent-icon"
import { categories, updates } from "@/lib/data/categories"
import { AGENT_TYPE_OPTIONS, getRuntimeLabel } from "@/lib/publish/constants"
import { emptyFilters, getRecency, hasActiveFilters, type MarketplaceFilters } from "@/lib/marketplace-filters"
import { cn } from "@/lib/utils"

type FilterBarProps = {
  agents: Agent[]
  className?: string
  filters: MarketplaceFilters
  onChange: (next: MarketplaceFilters) => void
}

function countBy<T extends string>(agents: Agent[], pick: (agent: Agent) => T) {
  const counts = new Map<T, number>()
  for (const agent of agents) {
    const key = pick(agent)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

function FilterCheckbox({
  name,
  count,
  checked,
  onChange,
  icon: Icon,
}: {
  name: string
  count: number
  checked: boolean
  onChange: () => void
  icon?: LucideIcon
}) {
  return (
    <label className="group -mx-2 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-primary/5 hover:text-foreground">
      <span className="relative flex shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span
          className={cn(
            "flex size-4 items-center justify-center rounded-[5px] border transition-all",
            checked
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-transparent text-transparent group-hover:border-primary/50"
          )}
        >
          <Check className="size-3" strokeWidth={3} />
        </span>
      </span>
      {Icon && <Icon className="size-3.5 shrink-0 text-muted-foreground" />}
      <span className="flex-1">{name}</span>
      <span className="rounded-full bg-muted/15 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
        {count.toLocaleString("en-US")}
      </span>
    </label>
  )
}

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 pb-5">
      <p className="mb-2 text-sm font-semibold text-foreground">{title}</p>
      {children}
    </div>
  )
}

export function FilterBar({ agents, className, filters, onChange }: FilterBarProps) {
  const categoryCounts = countBy(agents, (agent) => agent.category)
  const agentTypeCounts = countBy(agents, (agent) => agent.agent_type)
  const runtimeCounts = countBy(agents, (agent) => agent.runtime)
  const runtimeOptions = [...runtimeCounts.keys()].sort().map((runtime) => ({
    id: runtime,
    label: getRuntimeLabel(runtime),
  }))
  const updateCounts = countBy(agents, (agent) => getRecency(agent.updated_at))

  function toggle(key: keyof MarketplaceFilters, value: string) {
    const list = filters[key]
    onChange({
      ...filters,
      [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
    })
  }

  return (
    <div className={cn(className, "flex w-full flex-col gap-5 lg:w-56")}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-foreground">Filters</p>
        {hasActiveFilters(filters) && (
          <button
            type="button"
            onClick={() => onChange(emptyFilters)}
            className="text-xs font-medium text-primary hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      <FilterSection title="Categories">
        {categories.map((item) => (
          <FilterCheckbox
            key={item.slug}
            name={item.label}
            icon={item.icon}
            count={categoryCounts.get(item.slug) ?? 0}
            checked={filters.categories.includes(item.slug)}
            onChange={() => toggle("categories", item.slug)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Type">
        {AGENT_TYPE_OPTIONS.map((item) => (
          <FilterCheckbox
            key={item.id}
            name={item.label}
            count={agentTypeCounts.get(item.id) ?? 0}
            checked={filters.agent_types.includes(item.id)}
            onChange={() => toggle("agent_types", item.id)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Runtime">
        {runtimeOptions.map((item) => (
          <FilterCheckbox
            key={item.id}
            name={item.label}
            count={runtimeCounts.get(item.id) ?? 0}
            checked={filters.runtimes.includes(item.id)}
            onChange={() => toggle("runtimes", item.id)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Updated">
        {updates.map((item) => (
          <FilterCheckbox
            key={item.slug}
            name={item.label}
            count={updateCounts.get(item.slug) ?? 0}
            checked={filters.updates.includes(item.slug)}
            onChange={() => toggle("updates", item.slug)}
          />
        ))}
      </FilterSection>
    </div>
  )
}
