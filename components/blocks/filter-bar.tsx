"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

type FilterBarProps = {
  className?: string
}

const categories = [
  { name: "Tous les agents", value: "all", count: 2481 },
  { name: "Outils de développement", value: "dev-tools", count: 612 },
  { name: "Données et analyses", value: "data-analytics", count: 384 },
  { name: "Conception", value: "design", count: 142 },
  { name: "Productivité", value: "productivity", count: 298 },
  { name: "Security", value: "security", count: 174 },
  { name: "Service client", value: "customer-service", count: 221 },
  { name: "Recherche", value: "research", count: 156 },
  { name: "Marketing", value: "marketing", count: 188 },
]

const types = [
  { name: "Workflow", value: "workflow", count: 1462 },
  { name: "Agent autonome", value: "autonomous", count: 1019 },
]

const languages = [
  { name: "TypeScript", value: "typescript", count: 1148 },
  { name: "Python", value: "python", count: 1039 },
  { name: "Rust", value: "rust", count: 184 },
  { name: "Multi-runtime", value: "multi-runtime", count: 110 },
]

const miseajours = [
  { name: "Dernières 24 heures", value: "last-24h", count: 42 },
  { name: "La semaine dernière", value: "last-week", count: 261 },
  { name: "Le mois dernier", value: "last-month", count: 812 },
]

function FilterRow({
  name,
  count,
  selected,
  onClick,
}: {
  name: string
  count: number
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
        selected
          ? "bg-[#E7DFCE] font-medium text-foreground"
          : "text-foreground/80 hover:bg-foreground/5"
      )}
    >
      <span>{name}</span>
      <span className="font-mono text-xs text-[#A89F88] font-bold ml-2">
        {count.toLocaleString("fr-FR")}
      </span>
    </button>
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
    <div className="flex flex-col gap-1">
      <p className="px-3 font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
        {title}
      </p>
      {children}
    </div>
  )
}

export function FilterBar({ className }: FilterBarProps) {
  const [category, setCategory] = useState(categories[0].value)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedUpdates, setSelectedUpdates] = useState<string[]>([])

  function toggle(value: string, list: string[], setList: (values: string[]) => void) {
    setList(
      list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
    )
  }

  return (
    <div className={cn(className, "flex flex-col gap-6")}>
      <FilterSection title="Catégories">
        {categories.map((item) => (
          <FilterRow
            key={item.value}
            name={item.name}
            count={item.count}
            selected={category === item.value}
            onClick={() => setCategory(item.value)}
          />
        ))}
      </FilterSection>
        <Separator className="mb-0" />
      <FilterSection title="Type">
        {types.map((item) => (
          <FilterRow
            key={item.value}
            name={item.name}
            count={item.count}
            selected={selectedTypes.includes(item.value)}
            onClick={() => toggle(item.value, selectedTypes, setSelectedTypes)}
          />
        ))}
      </FilterSection>
        <Separator className="mb-0" />
      <FilterSection title="Language">
        {languages.map((item) => (
          <FilterRow
            key={item.value}
            name={item.name}
            count={item.count}
            selected={selectedLanguages.includes(item.value)}
            onClick={() => toggle(item.value, selectedLanguages, setSelectedLanguages)}
          />
        ))}
      </FilterSection>
        <Separator className="mb-0" />
      <FilterSection title="Mise à jour">
        {miseajours.map((item) => (
          <FilterRow
            key={item.value}
            name={item.name}
            count={item.count}
            selected={selectedUpdates.includes(item.value)}
            onClick={() => toggle(item.value, selectedUpdates, setSelectedUpdates)}
          />
        ))}
      </FilterSection>
    </div>
  )
}
