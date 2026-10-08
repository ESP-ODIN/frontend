import { Code2, Database, Headphones, FlaskConical, Megaphone, Palette, ShieldCheck, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type CategoryId =
  | "dev-tools"
  | "data-analytics"
  | "design"
  | "productivity"
  | "security"
  | "customer-service"
  | "research"
  | "marketing"

export type MarketplaceCategory = {
  slug: CategoryId
  label: string
  icon: LucideIcon
}

export const categories: MarketplaceCategory[] = [
  { slug: "dev-tools", label: "Developer tools", icon: Code2 },
  { slug: "data-analytics", label: "Data & analytics", icon: Database },
  { slug: "design", label: "Design", icon: Palette },
  { slug: "productivity", label: "Productivity", icon: Zap },
  { slug: "security", label: "Security", icon: ShieldCheck },
  { slug: "customer-service", label: "Customer service", icon: Headphones },
  { slug: "research", label: "Research", icon: FlaskConical },
  { slug: "marketing", label: "Marketing", icon: Megaphone },
]

export const updates: { slug: "last-24h" | "last-week" | "last-month"; label: string }[] = [
  { slug: "last-24h", label: "Last 24 hours" },
  { slug: "last-week", label: "Last week" },
  { slug: "last-month", label: "Last month" },
]
