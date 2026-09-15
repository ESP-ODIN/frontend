import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AgentCard } from "@/components/blocks/agent-card"
import { SectionHeader } from "@/components/blocks/landing/section-header"
import { agents } from "@/lib/data/agents"

type FeaturedAgentsProps = {
  className?: string
}

export function FeaturedAgents({ className }: FeaturedAgentsProps) {
  return (
    <div className={cn("flex flex-col items-center gap-10", className)}>
      <SectionHeader
        eyebrow="SÉLECTIONNÉS CETTE SEMAINE"
        title="Sélectionnés avec soin par l'équipe du registre."
      />

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
        {agents.map((agent) => (
          <AgentCard key={agent.slug} agent={agent} featured />
        ))}
      </div>

      <Button
        variant="outline"
        size="lg"
        icon={ArrowRight}
        iconPosition="right"
        className="rounded-full"
        render={<Link href="/marketplace" />}
      >
        Explorer tous les agents
      </Button>
    </div>
  )
}
