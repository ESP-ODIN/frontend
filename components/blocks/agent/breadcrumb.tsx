import Link from "next/link"

import { getCategoryLabel, type CategoryId } from "@/lib/data/categories"

type AgentBreadcrumbProps = {
  category: CategoryId
  name: string
}

export function AgentBreadcrumb({ category, name }: AgentBreadcrumbProps) {
  return (
    <p className="font-mono text-sm text-muted-foreground">
      <Link href="/marketplace" className="hover:text-foreground">
        Marketplace
      </Link>{" "}
      /{" "}
      <Link href={`/marketplace?category=${category}`} className="hover:text-foreground">
        {getCategoryLabel(category)}
      </Link>{" "}
      / <span className="text-foreground">{name}</span>
    </p>
  )
}
