import { FilterBar } from "@/components/blocks/filter-bar"
import { FilterSheet } from "@/components/blocks/marketplace/filter-sheet"
import { Hero } from "@/components/blocks/marketplace/hero"
import { Separator } from "@/components/ui/separator"
import { SpotlightCard } from "@/components/blocks/marketplace/SpotlightCard"
import { AgentGrid } from "@/components/blocks/marketplace/agent-grid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Marketplace — Odin",
  description: "Découvrez et installez des agents IA.",
}

export default function Page() {
  return (
    <>
    <Hero />
    <Separator />
    <div className="flex flex-col gap-10 lg:flex-row">
        <div className="hidden lg:flex">
            <FilterBar />
        </div>
        <div className="flex min-w-0 flex-col flex-2 gap-6 sm:gap-8">
            <FilterSheet />
            <SpotlightCard />
            <AgentGrid />
        </div>
    </div>
    </>

  )
}
