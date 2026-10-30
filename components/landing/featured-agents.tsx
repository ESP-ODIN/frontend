import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AgentCard } from "@/components/agent/agent-card"
import type { Agent } from "@/lib/agents/types"
import { SectionHeader } from "@/components/landing/section-header"
import { TiltCard } from "@/components/motion/tilt-card"
import { ScrollReveal } from "@/components/motion/scroll-reveal"
import { Magnetic } from "@/components/motion/magnetic"
import { DevMark } from "@/components/dev/dev-mark"

type FeaturedAgentsProps = {
  agents: Agent[]
}

export function FeaturedAgents({ agents }: FeaturedAgentsProps) {
  const picked = agents.filter((agent) => agent.featured).slice(0, 3)

  return (
    <div id="agents" className="flex scroll-mt-28 flex-col items-center gap-10">
      <SectionHeader
        eyebrow={
          <>
            PICKED THIS WEEK{" "}
            <DevMark kind="missing" note="featured: not in the API, every agent counts as featured" />
          </>
        }
        title="Hand-picked by the registry team."
      />

      {picked.length === 0 ? (
        <p className="text-muted-foreground">No hand-picked agents this week.</p>
      ) : (
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
          {picked.map((agent, index) => (
            <ScrollReveal key={agent.id} delay={index * 100}>
              <TiltCard className="rounded-xl">
                <AgentCard agent={agent} />
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      )}

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
