import type { LucideIcon } from "lucide-react"

import type { CategoryId } from "@/lib/data/categories"

export type AgentType = "workflow" | "autonomous"
export type AgentRecency = "last-24h" | "last-week" | "last-month"

export type Agent = {
  id: string
  name: string
  creator_id: string
  description: string
  tags?: string[]
  likes?: string
  saves?: string
  followers?: string
  downloads_count: number
  version?: string
  icon?: LucideIcon
  is_official_pick: boolean
  /** A passé les tests de sécurité. Un agent non sécurisé n'est jamais publié. */
  secure: boolean
  featured?: boolean
  category: CategoryId
  agent_type: AgentType
  runtime: string
  created_at?: string
  updated_at: string
}
