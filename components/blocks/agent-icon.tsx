import type { LucideIcon } from "lucide-react"

import type { CategoryId } from "@/lib/data/categories"
import { cn } from "@/lib/utils"

export type AgentType = "workflow" | "autonomous"
export type AgentRuntime = "typescript" | "python" | "rust" | "multi-runtime"
export type AgentRecency = "last-24h" | "last-week" | "last-month"

export type Agent = {
  id: string
  name: string
  creator_id: string
  description: string
  tags: string[]
  stars: string
  downloads_count: number
  version: string
  icon?: LucideIcon
  is_official_pick: boolean
  category: CategoryId
  agent_type: AgentType
  runtime: AgentRuntime
  updated_at: string
}

type AgentIconProps = {
  icon?: LucideIcon
  name: string
  className?: string
}

export function AgentIcon({ icon: Icon, name, className }: AgentIconProps) {
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-bold text-primary",
        className
      )}
    >
      {Icon ? <Icon className="size-5" /> : name.slice(0, 2).toUpperCase() || "??"}
    </div>
  )
}
