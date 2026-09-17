"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type FilterBarProps = {
  className?: string
}

const categories = [
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

function FilterCheckbox({
  name,
  count,
  checked,
  onChange,
}: {
  name: string
  count: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex items-center gap-2.5 py-1 text-sm text-foreground/80 cursor-pointer hover:text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 rounded border-border accent-primary"
      />
      <span className="flex-1">{name}</span>
      <span className="text-xs text-muted-foreground">{count.toLocaleString("fr-FR")}</span>
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
    <div className="flex flex-col gap-1 border-b border-border/60 pb-5">
      <p className="mb-2 text-sm font-semibold text-foreground">{title}</p>
      {children}
    </div>
  )
}

export function FilterBar({ className }: FilterBarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedUpdates, setSelectedUpdates] = useState<string[]>([])

  function toggle(value: string, list: string[], setList: (values: string[]) => void) {
    setList(
      list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
    )
  }

  return (
    <div className={cn(className, "flex w-full flex-col gap-5 lg:w-56")}>
      <FilterSection title="Catégories">
        {categories.map((item) => (
          <FilterCheckbox
            key={item.value}
            name={item.name}
            count={item.count}
            checked={selectedCategories.includes(item.value)}
            onChange={() => toggle(item.value, selectedCategories, setSelectedCategories)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Type">
        {types.map((item) => (
          <FilterCheckbox
            key={item.value}
            name={item.name}
            count={item.count}
            checked={selectedTypes.includes(item.value)}
            onChange={() => toggle(item.value, selectedTypes, setSelectedTypes)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Language">
        {languages.map((item) => (
          <FilterCheckbox
            key={item.value}
            name={item.name}
            count={item.count}
            checked={selectedLanguages.includes(item.value)}
            onChange={() => toggle(item.value, selectedLanguages, setSelectedLanguages)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Mise à jour">
        {miseajours.map((item) => (
          <FilterCheckbox
            key={item.value}
            name={item.name}
            count={item.count}
            checked={selectedUpdates.includes(item.value)}
            onChange={() => toggle(item.value, selectedUpdates, setSelectedUpdates)}
          />
        ))}
      </FilterSection>
    </div>
  )
}
