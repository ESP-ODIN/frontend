import { FilterBar } from "@/components/blocks/filter-bar"
import { Hero } from "@/components/blocks/marketplace/hero"
import { Separator } from "@/components/ui/separator"
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
    <div>
        <div className="flex flex-1">
            <FilterBar />
        </div>
        <div className="flex flex-col flex-2">

        </div>
    </div>
    </>

  )
}
