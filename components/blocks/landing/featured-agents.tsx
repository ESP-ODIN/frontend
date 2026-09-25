import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AgentCard } from "@/components/blocks/agent-card"
import { SectionHeader } from "@/components/blocks/landing/section-header"
import { TiltCard } from "@/components/motion/tilt-card"
import { ScrollReveal } from "@/components/motion/scroll-reveal"
import { Magnetic } from "@/components/motion/magnetic"
import { agents } from "@/lib/data/agents"

export function FeaturedAgents() {
  return (
    <div id="agents" className="flex scroll-mt-28 flex-col items-center gap-10">
      <SectionHeader
        eyebrow="PICKED THIS WEEK"
        title="Hand-picked by the registry team."
      />

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
        {agents.slice(0, 3).map((agent, index) => (
          <ScrollReveal key={agent.slug} delay={index * 100}>
            <TiltCard className="rounded-xl">
              <AgentCard agent={agent} featured />
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>

      <Magnetic>
        <Button
          variant="outline"
          size="lg"
          icon={ArrowRight}
          iconPosition="right"
          className="rounded-full"
          render={<Link href="/marketplace" />}
        >
          Explore all agents
        </Button>
      </Magnetic>
    </div>
  )
}
