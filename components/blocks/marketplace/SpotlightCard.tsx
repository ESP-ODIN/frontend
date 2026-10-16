"use client"

import { useEffect, useState } from "react"
import { MoveDown, Star } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { formatCompactCount } from "@/lib/format-count"
import { formatTimeAgo } from "@/lib/format-time-ago"
import { getRuntimeLabel } from "@/lib/publish/constants"
import type { Agent } from "@/components/blocks/agent-icon"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AuroraBackground } from "@/components/motion/aurora-background"
import { CopyCommand } from "@/components/motion/copy-command"
import { Magnetic } from "@/components/motion/magnetic"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

const ROTATION_INTERVAL_MS = 6000

type SpotlightCardProps = {
  agents: Agent[]
}

export function SpotlightCard({ agents }: SpotlightCardProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (agents.length < 2 || paused) return
    const timer = setInterval(() => setIndex((current) => (current + 1) % agents.length), ROTATION_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [agents.length, paused])

  if (agents.length === 0) return null

  const agent = agents[index % agents.length]

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-[#14110C] p-4 text-[#F6F1E6] sm:p-6 lg:p-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AuroraBackground className="opacity-80" />
      <ScrollReveal className="relative">
        <div key={agent.id} className="flex animate-in flex-col gap-5 duration-500 fade-in-0 sm:gap-8 lg:flex-row lg:gap-0">
          <div className="flex flex-2 flex-col gap-3 sm:gap-4">
            <div>
              <p className="font-mono text-xs text-primary uppercase sm:text-sm">Spotlight · Odin&apos;s pick</p>
              <h2 className="mt-2 font-mono text-xl font-bold sm:text-2xl lg:text-3xl">{agent.name}</h2>
              {agent.version && (
                <h2 className="mt-1 font-mono text-xl font-semibold sm:text-2xl lg:text-3xl">
                  v{agent.version} just launched.
                </h2>
              )}
              <p className="line-clamp-2 text-sm text-[#F6F1E6]/60 sm:line-clamp-none">{agent.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Magnetic>
                <Button className="fx-shine" render={<Link href={`/agents/${agent.id}`} />}>
                  Install
                </Button>
              </Magnetic>
              <Button
                className="border-white/15 bg-white/5 text-[#F6F1E6] hover:bg-white/10 hover:text-[#F6F1E6]"
                variant="outline"
                render={<Link href={`/agents/${agent.id}`} />}
              >
                View details
              </Button>
            </div>
            <p className="flex flex-wrap items-center gap-1 text-xs text-[#F6F1E6]/60 sm:text-sm">
              <Star className="size-4" /> {agent.stars ?? "—"} • <MoveDown className="size-4" />{" "}
              {formatCompactCount(agent.downloads_count)} installs by {agent.creator_id} • Updated{" "}
              {formatTimeAgo(agent.updated_at)}
            </p>

            <CopyCommand className="w-fit max-w-full overflow-x-auto text-xs lg:hidden" command={`odin install ${agent.name}`} />
          </div>
          <Separator orientation="vertical" className="mx-8 hidden bg-white/10 lg:block" />
          <div className="hidden flex-1 flex-col justify-center gap-6 lg:flex">
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 font-mono text-sm [&>dd]:m-0">
              <dt className="text-[#F6F1E6]/40">Manifest</dt>
              <dd>{agent.name}</dd>

              <dt className="text-[#F6F1E6]/40">Version</dt>
              <dd>{agent.version ?? "—"}</dd>

              <dt className="text-[#F6F1E6]/40">Type</dt>
              <dd>{agent.agent_type}</dd>

              <dt className="text-[#F6F1E6]/40">Runtime</dt>
              <dd>{getRuntimeLabel(agent.runtime)}</dd>

              <dt className="text-[#F6F1E6]/40">Sandbox</dt>
              <dd>—</dd>
            </dl>

            <div>
              <CopyCommand className="text-xs" command={`odin install ${agent.name}`} />
            </div>
          </div>
        </div>

        {agents.length > 1 && (
          <div className="mt-5 flex justify-center gap-2 lg:justify-start">
            {agents.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Show ${item.name}`}
                aria-current={i === index % agents.length}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index % agents.length ? "w-6 bg-primary" : "w-1.5 bg-white/25 hover:bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </ScrollReveal>
    </div>
  )
}
