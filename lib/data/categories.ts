import { Code2, Database, Headphones, FlaskConical, Megaphone, Palette, ShieldCheck, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type MarketplaceCategory = {
  slug: string
  label: string
  icon: LucideIcon
}

export const categories: MarketplaceCategory[] = [
  { slug: "dev-tools", label: "Outils de développement", icon: Code2 },
  { slug: "data-analytics", label: "Données et analyses", icon: Database },
  { slug: "design", label: "Conception", icon: Palette },
  { slug: "productivity", label: "Productivité", icon: Zap },
  { slug: "security", label: "Sécurité", icon: ShieldCheck },
  { slug: "customer-service", label: "Service client", icon: Headphones },
  { slug: "research", label: "Recherche", icon: FlaskConical },
  { slug: "marketing", label: "Marketing", icon: Megaphone },
]

export const types: { slug: "workflow" | "autonomous"; label: string }[] = [
  { slug: "workflow", label: "Workflow" },
  { slug: "autonomous", label: "Agent autonome" },
]

export const languages: { slug: "typescript" | "python" | "rust" | "multi-runtime"; label: string }[] = [
  { slug: "typescript", label: "TypeScript" },
  { slug: "python", label: "Python" },
  { slug: "rust", label: "Rust" },
  { slug: "multi-runtime", label: "Multi-runtime" },
]

export const updates: { slug: "last-24h" | "last-week" | "last-month"; label: string }[] = [
  { slug: "last-24h", label: "Dernières 24 heures" },
  { slug: "last-week", label: "La semaine dernière" },
  { slug: "last-month", label: "Le mois dernier" },
]
