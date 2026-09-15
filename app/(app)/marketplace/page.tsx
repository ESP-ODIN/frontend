import { FilterBar } from "@/components/blocks/filter-bar"
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
    <div className="flex gap-10">
        <div className="flex">
            <FilterBar />
        </div>
        <div className="flex flex-col flex-2 gap-8">
            <SpotlightCard />
            <AgentGrid />
        </div>
    </div>
    </>

  )
}
