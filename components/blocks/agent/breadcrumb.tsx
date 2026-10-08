import Link from "next/link"

import type { CategoryId } from "@/lib/data/categories"

type AgentBreadcrumbProps = {
  category: CategoryId
  categoryLabel: string
  name: string
}

export function AgentBreadcrumb({ category, categoryLabel, name }: AgentBreadcrumbProps) {
  return (
    <p className="font-mono text-sm text-muted-foreground">
      <Link href="/marketplace" className="hover:text-foreground">
        Marketplace
      </Link>{" "}
      /{" "}
      <Link href={`/marketplace?category=${category}`} className="hover:text-foreground">
        {categoryLabel}
      </Link>{" "}
      / <span className="text-foreground">{name}</span>
    </p>
  )
}
