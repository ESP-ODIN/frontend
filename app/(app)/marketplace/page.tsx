import { Hero } from "@/components/blocks/marketplace/hero"
import { Separator } from "@/components/ui/separator"
import { MarketplaceBrowser } from "@/components/blocks/marketplace/browser"
import type { Metadata } from "next"

import { getMarketplaceAgents } from "@/lib/api/agents"

export const metadata: Metadata = {
  title: "Marketplace — Odin",
  description: "Discover and install AI agents.",
}

export default async function Page() {
  const agents = await getMarketplaceAgents()

  return (
    <>
      <Hero />
      <Separator />
      <MarketplaceBrowser agents={agents} />
    </>
  )
}
