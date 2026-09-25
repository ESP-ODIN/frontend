"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import type { Agent } from "@/components/blocks/agent-icon"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AgentCard } from "@/components/blocks/agent-card"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

type AgentGridProps = {
  agents: Agent[]
  className?: string
  pageSize?: number
}

export function AgentGrid({ agents, className, pageSize = 9 }: AgentGridProps) {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(agents.length / pageSize))
  const pageAgents = agents.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount))
  }, [pageCount])

  if (agents.length === 0) {
    return (
      <div className={cn(className, "flex flex-col items-center gap-2 rounded-xl border border-dashed border-border/60 py-16 text-center")}>
        <p className="font-medium text-foreground">No agent matches these filters.</p>
        <p className="text-sm text-muted-foreground">Try removing a few.</p>
      </div>
    )
  }

  return (
    <div className={cn(className, "flex flex-col gap-8")}>
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pageAgents.map((agent, i) => (
          <ScrollReveal key={agent.slug} delay={(i % pageSize) * 40}>
            <AgentCard agent={agent} featured={agent.featured} />
          </ScrollReveal>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          icon={ArrowLeft}
          iconPosition="left"
          className="rounded-full"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </Button>
        <p className="font-mono text-sm text-muted-foreground">
          Page {page} of {pageCount}
        </p>
        <Button
          variant="outline"
          icon={ArrowRight}
          iconPosition="right"
          className="rounded-full"
          disabled={page >= pageCount}
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
