import type { LucideIcon } from "lucide-react"
import { Boxes, Download, ShieldCheck, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { countAuthors } from "@/lib/agent-stats"
import type { Agent } from "@/components/blocks/agent-icon"
import { StatCounter } from "@/components/motion/stat-counter"
import { ScrollReveal } from "@/components/motion/scroll-reveal"
import { DevMark } from "@/components/dev/dev-mark"

type StatItem = {
  icon: LucideIcon
  target: number
  decimals?: number
  suffix?: string
  label: string
  mock?: string
}

type StatsProps = {
  agents: Agent[]
}

export function Stats({ agents }: StatsProps) {
  const stats: StatItem[] = [
    { icon: Boxes, target: agents.length, label: "PUBLISHED AGENTS" },
    {
      icon: Download,
      target: 14.2,
      decimals: 1,
      suffix: "M",
      label: "INSTALLS / MONTH",
      mock: "no monthly installs endpoint in the API",
    },
    { icon: Users, target: countAuthors(agents), label: "AUTHORS" },
    {
      icon: ShieldCheck,
      target: 99.98,
      decimals: 2,
      suffix: "%",
      label: "SECURITY TESTS PASSED",
      mock: "no security results in the API",
    },
  ]

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-muted/40 sm:grid-cols-4">
      {stats.map((stat, index) => (
        <ScrollReveal
          key={stat.label}
          delay={index * 80}
          className={cn(
            "group flex flex-col items-center justify-center gap-2 p-6 text-center transition-colors hover:bg-primary/5 sm:p-8",
            index % 2 !== 0 && "border-l border-muted/40",
            index >= 2 && "border-t border-muted/40",
            "sm:border-t-0",
            index !== 0 && "sm:border-l"
          )}
        >
          <stat.icon className="mb-1 size-5 text-primary opacity-70 transition-transform group-hover:scale-110" />
          <p className="text-3xl font-bold tabular-nums text-foreground">
            <StatCounter target={stat.target} decimals={stat.decimals} suffix={stat.suffix} />
          </p>
          <p className="font-mono text-xs tracking-wider text-muted-foreground">
            {stat.label} {stat.mock && <DevMark kind="mock" note={stat.mock} />}
          </p>
        </ScrollReveal>
      ))}
    </div>
  )
}
