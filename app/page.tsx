import { FloatingNav } from "@/components/layout/floating-nav"
import { Hero } from "@/components/blocks/landing/hero"
import { Stats } from "@/components/blocks/landing/stats"
import { Terminal } from "@/components/blocks/terminal"
import { Values } from "@/components/blocks/landing/values"
import { HowItWorks } from "@/components/blocks/landing/how-it-works"
import { Platform } from "@/components/blocks/landing/platform"
import { FeaturedAgents } from "@/components/blocks/landing/featured-agents"
import { Cta } from "@/components/blocks/landing/cta"
import { ScrollReveal } from "@/components/motion/scroll-reveal"
import { getMarketplaceAgents } from "@/lib/api/agents"

const links = [
  { label: "Features", href: "#values" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Platform", href: "#platform" },
  { label: "Agents", href: "#agents" },
]

export default async function Page() {
  // The landing stays up when the marketplace API is down: sections fall back to empty states
  const agents = await getMarketplaceAgents().catch(() => [])

  return (
    <main className="pt-24 sm:pt-28">
      <FloatingNav links={links} smoothScroll />
      <div className="flex flex-col gap-14 sm:gap-20">
        <Hero />
        <Stats agents={agents} />
        <ScrollReveal>
          <Terminal />
        </ScrollReveal>
        <Values />
        <HowItWorks />
        <Platform agents={agents} />
        <FeaturedAgents agents={agents} />
        <Cta />
      </div>
    </main>
  )
}
