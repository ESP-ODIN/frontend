import type { LucideIcon } from "lucide-react"
import { Boxes, Download, ShieldCheck, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { StatCounter } from "@/components/motion/stat-counter"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

type StatItem = {
  icon: LucideIcon
  target: number
  decimals?: number
  suffix?: string
  label: string
}

const stats: StatItem[] = [
  { icon: Boxes, target: 2481, label: "AGENTS PUBLIÉS" },
  { icon: Download, target: 14.2, decimals: 1, suffix: "M", label: "INSTALLATIONS / MOIS" },
  { icon: Users, target: 38, suffix: "K", label: "AUTEURS" },
  { icon: ShieldCheck, target: 99.98, decimals: 2, suffix: "%", label: "TESTS DE SÉCURITÉ PASSÉS" },
]

export function Stats() {
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
          <p className="font-mono text-xs tracking-wider text-muted-foreground">{stat.label}</p>
        </ScrollReveal>
      ))}
    </div>
  )
}
