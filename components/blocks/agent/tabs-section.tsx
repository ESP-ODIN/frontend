"use client"

import { useState } from "react"

import type { AgentDetail } from "@/lib/api/agents"
import { cn } from "@/lib/utils"
import { AgentOverview } from "@/components/blocks/agent/overview"

type AgentTabsSectionProps = {
  detail: AgentDetail
}

const tabs = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "changelog", label: "Changelog" },
  { id: "community", label: "REX communauté", count: 38 },
  { id: "security", label: "Sécurité" },
] as const

export function AgentTabsSection({ detail }: AgentTabsSectionProps) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("overview")

  return (
    <div className="flex flex-col gap-8">
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto border-b border-border/60 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors",
                active === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {"count" in tab && (
                <span className="rounded-full bg-muted/15 px-1.5 py-0.5 text-xs text-muted-foreground">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent sm:hidden" />
      </div>

      {active === "overview" ? (
        <AgentOverview detail={detail} />
      ) : (
        <p className="text-muted-foreground">Bientôt disponible.</p>
      )}
    </div>
  )
}
