import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { getAgent, getAgentDetail } from "@/lib/data/agent-details"
import { Separator } from "@/components/ui/separator"
import { AgentBreadcrumb } from "@/components/blocks/agent/breadcrumb"
import { AgentHeader } from "@/components/blocks/agent/header"
import { AgentInstallBar } from "@/components/blocks/agent/install-bar"
import { AgentStatsBar } from "@/components/blocks/agent/stats-bar"
import { AgentTabsSection } from "@/components/blocks/agent/tabs-section"
import { AgentSidebar } from "@/components/blocks/agent/sidebar"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const agent = getAgent(id)

  return {
    title: agent ? `${agent.name} — Odin` : "Agent introuvable — Odin",
    description: agent?.description,
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const agent = getAgent(id)
  const detail = getAgentDetail(id)

  if (!agent || !detail) notFound()

  return (
    <div className="flex flex-col gap-8 px-10 py-8">
      <AgentBreadcrumb categorySlug={detail.categorySlug} name={agent.name} />
      <AgentHeader agent={agent} detail={detail} />
      <AgentInstallBar agent={agent} detail={detail} />
      <AgentStatsBar detail={detail} />
      <Separator className="mb-0" />

      <div className="flex gap-10">
        <div className="flex-1">
          <AgentTabsSection detail={detail} />
        </div>
        <AgentSidebar agent={agent} detail={detail} />
      </div>
    </div>
  )
}
