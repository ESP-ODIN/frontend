import Link from "next/link"

type AgentBreadcrumbProps = {
  categorySlug: string
  name: string
}

export function AgentBreadcrumb({ categorySlug, name }: AgentBreadcrumbProps) {
  return (
    <p className="font-mono text-sm text-muted-foreground">
      <Link href="/marketplace" className="hover:text-foreground">
        Marketplace
      </Link>{" "}
      /{" "}
      <Link href={`/marketplace?category=${categorySlug}`} className="hover:text-foreground">
        {categorySlug}
      </Link>{" "}
      / <span className="text-foreground">{name}</span>
    </p>
  )
}
