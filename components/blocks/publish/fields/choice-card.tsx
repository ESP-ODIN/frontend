"use client"

import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type ChoiceCardProps = {
  icon: LucideIcon
  label: string
  description: string
  selected: boolean
  onSelect: () => void
}

export function ChoiceCard({
  icon: Icon,
  label,
  description,
  selected,
  onSelect,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5",
        selected
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
          : "border-muted/40 bg-background-100 hover:border-primary/30"
      )}
    >
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-lg transition-colors",
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-muted/15 text-muted-foreground group-hover:text-foreground"
        )}
      >
        <Icon className="size-4" />
      </div>
      <p className="font-mono text-sm font-bold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </button>
  )
}
