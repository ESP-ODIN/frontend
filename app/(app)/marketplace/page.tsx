import { Hero } from "@/components/blocks/marketplace/hero"
import { Separator } from "@/components/ui/separator"
import { MarketplaceBrowser } from "@/components/blocks/marketplace/browser"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Marketplace — Odin",
  description: "Discover and install AI agents.",
}

export default function Page() {
  return (
    <>
      <Hero />
      <Separator />
      <MarketplaceBrowser />
    </>
  )
}
