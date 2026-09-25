import Link from "next/link"
import { ArrowRight, Shield, Users, Zap, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { IconTile } from "@/components/blocks/icon-tile"
import { SectionHeader } from "@/components/blocks/landing/section-header"
import { SpotlightPanel } from "@/components/motion/spotlight-panel"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

type ValueItem = {
  label: string
  description: string
  icon: LucideIcon
  href: string
  cta: string
}

const values: ValueItem[] = [
  {
    label: "Sharing",
    description:
      "I give my agents visibility and connect with the community — every release enriches the shared ecosystem.",
    icon: Users,
    href: "/publish",
    cta: "Publish an agent",
  },
  {
    label: "Security",
    description:
      "Every agent is verified, its actions are controlled and traced. You know exactly what your agent does — and what it can't do.",
    icon: Shield,
    href: "/permissions",
    cta: "See permissions",
  },
  {
    label: "Accessibility",
    description:
      "Agents within everyone's reach — one command is all it takes. No complex setup, no technical prerequisites.",
    icon: Zap,
    href: "/get-started",
    cta: "Get started now",
  },
]

type ValuesProps = {
  className?: string
}

export function Values({ className }: ValuesProps) {
  return (
    <div id="values" className={cn("flex scroll-mt-28 flex-col items-center gap-10", className)}>
      <SectionHeader eyebrow="OUR VALUES" title="What makes Odin different." />

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {values.map(({ label, description, icon, href, cta }, index) => (
          <ScrollReveal key={label} delay={index * 100}>
            <SpotlightPanel className="group flex h-full flex-col gap-5 rounded-2xl border border-muted/40 bg-background-100 p-6 transition-colors hover:border-primary/30 sm:p-8">
              <IconTile icon={icon} className="transition-transform group-hover:-translate-y-0.5 group-hover:scale-105" />
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-foreground">{label}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
              <Link
                href={href}
                className="mt-auto flex items-center gap-1 pt-4 font-mono text-sm text-primary hover:underline"
              >
                {cta}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </SpotlightPanel>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
