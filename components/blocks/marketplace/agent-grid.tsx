"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AgentCard } from "@/components/blocks/agent-card"
import { agents as baseAgents } from "@/lib/data/agents"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

type AgentGridProps = {
  className?: string
  pageSize?: number
}

// Demo dataset only: the real catalogue has thousands of agents, this repeats
// the mock entries (keeping their real slug so links to /agent/[id] stay valid)
// so pagination has something to page through.
const demoAgents = Array.from({ length: 60 }, (_, i) => baseAgents[i % baseAgents.length])

export function AgentGrid({ className, pageSize = 9 }: AgentGridProps) {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(demoAgents.length / pageSize))
  const pageAgents = demoAgents.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className={cn(className, "flex flex-col gap-8")}>
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pageAgents.map((agent, i) => (
          <ScrollReveal key={`${agent.slug}-${i}`} delay={(i % pageSize) * 40}>
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
