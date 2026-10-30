"use client"

import { useState } from "react"
import { History, MessagesSquare, ShieldCheck, type LucideIcon } from "lucide-react"

import type { AgentDetail } from "@/lib/api/agents"
import { cn } from "@/lib/utils"
import { AgentOverview } from "@/components/blocks/agent/overview"
import { IconTile } from "@/components/blocks/icon-tile"
import { DevMark } from "@/components/dev/dev-mark"

type AgentTabsSectionProps = {
  detail: AgentDetail
}

type UpcomingTab = {
  icon: LucideIcon
  title: string
  description: string
  // Shown on the dev marker: what the API is missing for this tab
  missing: string
}

type Tab = { id: string; label: string; upcoming?: UpcomingTab }

const tabs: Tab[] = [
  { id: "overview", label: "Overview" },
  {
    id: "changelog",
    label: "Changelog",
    upcoming: {
      icon: History,
      title: "Version history is on its way",
      description: "Every release of this agent, with its changelog and what changed between versions.",
      missing: "changelog: agent_version exists in the DB but no endpoint exposes it",
    },
  },
  {
    id: "community",
    label: "Community reports",
    upcoming: {
      icon: MessagesSquare,
      title: "Community reports are coming",
      description: "Field reports, tips and configs shared by people running this agent in production.",
      missing: "community reports: not wired to the social API",
    },
  },
  {
    id: "security",
    label: "Security",
    upcoming: {
      icon: ShieldCheck,
      title: "Security results are coming",
      description: "The results of each security test run: static analysis, vulnerability scan and sandboxed run.",
      missing: "security results are not in the API",
    },
  },
]

function UpcomingPanel({ upcoming }: { upcoming: UpcomingTab }) {
  return (
    <div className="relative flex animate-in flex-col items-center gap-4 overflow-hidden rounded-2xl border border-dashed border-border/70 bg-gradient-to-b from-primary/5 to-transparent px-6 py-14 text-center duration-500 fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none">
      <span className="relative flex">
        <span aria-hidden className="fx-pulse-ring absolute inset-0 rounded-xl bg-primary/20" />
        <IconTile icon={upcoming.icon} className="relative" />
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 font-mono text-[11px] tracking-wider text-primary uppercase">
        <span className="fx-live-dot size-1.5 rounded-full bg-primary" />
        In progress
      </span>
      <h3 className="text-xl font-bold text-foreground">
        {upcoming.title} <DevMark kind="missing" note={upcoming.missing} />
      </h3>
      <p className="max-w-md text-muted-foreground">{upcoming.description}</p>
    </div>
  )
}

export function AgentTabsSection({ detail }: AgentTabsSectionProps) {
  const [activeId, setActiveId] = useState(tabs[0].id)
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0]

  return (
    <div className="flex flex-col gap-8">
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto border-b border-border/60 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors",
                activeId === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {tab.upcoming && (
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] leading-none text-primary">
                  soon
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent sm:hidden" />
      </div>

      {active.upcoming ? (
        <UpcomingPanel key={active.id} upcoming={active.upcoming} />
      ) : (
        <AgentOverview detail={detail} />
      )}
    </div>
  )
}
