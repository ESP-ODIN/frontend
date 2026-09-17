// Landing page

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

const links = [
  { label: "Fonctionnalités", href: "#values" },
  { label: "Comment ça marche", href: "#how-it-works" },
  { label: "Plateforme", href: "#platform" },
  { label: "Agents", href: "#agents" },
]

export default function Page() {
  return (
    <main className="pt-24 sm:pt-28">
      <FloatingNav links={links} smoothScroll />
      <div className="flex flex-col gap-14 sm:gap-20">
        <Hero />
        <Stats />
        <ScrollReveal>
          <Terminal />
        </ScrollReveal>
        <Values />
        <HowItWorks />
        <Platform />
        <FeaturedAgents />
        <Cta />
      </div>
    </main>
  )
}
