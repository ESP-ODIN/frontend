import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { getAgent, getAgentDetail } from "@/lib/api/agents"
import { Separator } from "@/components/ui/separator"
import { AgentBreadcrumb } from "@/components/blocks/agent/breadcrumb"
import { AgentHeader } from "@/components/blocks/agent/header"
import { AgentInstallBar } from "@/components/blocks/agent/install-bar"
import { AgentStatsBar } from "@/components/blocks/agent/stats-bar"
import { AgentTabsSection } from "@/components/blocks/agent/tabs-section"
import { AgentSidebar } from "@/components/blocks/agent/sidebar"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const agent = await getAgent(id)

  return {
    title: agent ? `${agent.name} — Odin` : "Agent not found — Odin",
    description: agent?.description,
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const [agent, detail] = await Promise.all([getAgent(id), getAgentDetail(id)])

  if (!agent || !detail) notFound()

  return (
    <div className="flex flex-col gap-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <ScrollReveal>
        <AgentBreadcrumb categorySlug={detail.categorySlug} name={agent.name} />
      </ScrollReveal>
      <ScrollReveal delay={60}>
        <AgentHeader agent={agent} detail={detail} />
      </ScrollReveal>
      <ScrollReveal delay={120} className="flex flex-col gap-8">
        <AgentInstallBar agentSlug={agent.slug} agentName={agent.name} detail={detail} />
        <AgentStatsBar detail={detail} />
      </ScrollReveal>
      <Separator className="mb-0" />

      <div className="flex flex-col gap-10 lg:flex-row">
        <ScrollReveal delay={160} className="min-w-0 flex-1">
          <AgentTabsSection detail={detail} />
        </ScrollReveal>
        <AgentSidebar agent={agent} detail={detail} />
      </div>
    </div>
  )
}
