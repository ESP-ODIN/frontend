import { Hero } from "@/components/blocks/marketplace/hero"
import { Separator } from "@/components/ui/separator"
import { MarketplaceBrowser } from "@/components/blocks/marketplace/browser"
import type { Metadata } from "next"

import { getMarketplaceAgents } from "@/lib/api/agents"

export const metadata: Metadata = {
  title: "Marketplace — Odin",
  description: "Discover and install AI agents.",
}

type PageProps = {
  searchParams: Promise<{ q?: string | string[]; tag?: string | string[] }>
}

export default async function Page({ searchParams }: PageProps) {
  const [agents, { q, tag }] = await Promise.all([getMarketplaceAgents(), searchParams])
  const initialQuery = Array.isArray(q) ? (q[0] ?? "") : (q ?? "")
  const initialTags = tag === undefined ? [] : Array.isArray(tag) ? tag : [tag]

  return (
    <>
      <Hero />
      <Separator />
      <MarketplaceBrowser agents={agents} initialQuery={initialQuery} initialTags={initialTags} />
    </>
  )
}
