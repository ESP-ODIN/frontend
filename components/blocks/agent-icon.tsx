import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export const agentColorVariants = {
  primary: "bg-primary/10 text-primary",
  amber: "bg-amber-100 text-amber-900",
  blue: "bg-blue-100 text-blue-900",
  red: "bg-red-100 text-red-900",
  muted: "bg-muted/15 text-foreground",
} as const

export type AgentColor = keyof typeof agentColorVariants

export type AgentType = "workflow" | "autonomous"
export type AgentLanguage = "typescript" | "python" | "rust" | "multi-runtime"
export type AgentRecency = "last-24h" | "last-week" | "last-month"

export type AgentCategory = {
  slug: string
  label: string
}

export type Agent = {
  slug: string
  name: string
  author: string
  description: string
  tags: string[]
  stars: string
  downloads: string
  version: string
  color: AgentColor
  featured?: boolean
  category: AgentCategory
  type: AgentType
  language: AgentLanguage
  recency: AgentRecency
} & ({ icon: LucideIcon; label?: never } | { icon?: never; label: string })

type AgentIconProps = {
  icon?: LucideIcon
  label?: string
  color: AgentColor
  className?: string
}

export function AgentIcon({ icon: Icon, label, color, className }: AgentIconProps) {
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold",
        agentColorVariants[color],
        className
      )}
    >
      {Icon ? <Icon className="size-5" /> : label}
    </div>
  )
}
