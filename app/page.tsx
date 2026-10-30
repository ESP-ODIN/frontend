import { FloatingNav } from "@/components/layout/floating-nav"
import { Hero } from "@/components/landing/hero"
import { Stats } from "@/components/landing/stats"
import { Terminal } from "@/components/shared/terminal"
import { Values } from "@/components/landing/values"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Platform } from "@/components/landing/platform"
import { FeaturedAgents } from "@/components/landing/featured-agents"
import { Cta } from "@/components/landing/cta"
import { ScrollReveal } from "@/components/motion/scroll-reveal"
import { getMarketplaceAgents } from "@/lib/api/agents"

const links = [
  { label: "Features", href: "#values" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Platform", href: "#platform" },
  { label: "Agents", href: "#agents" },
]

export default async function Page() {
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
