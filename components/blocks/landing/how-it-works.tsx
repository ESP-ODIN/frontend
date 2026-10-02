import { Code, GitBranch, Package, Shield, Users, Zap, type LucideIcon } from "lucide-react"

import { IconTile } from "@/components/blocks/icon-tile"
import { SectionHeader } from "@/components/blocks/landing/section-header"
import { SpotlightPanel } from "@/components/motion/spotlight-panel"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

type FeatureItem = {
  title: string
  description: string
  icon: LucideIcon
}

const features: FeatureItem[] = [
  {
    title: "One install command",
    description:
      "Every agent on Odin installs and runs through the same CLI. No custom setup, no copy-pasted scripts.",
    icon: Package,
  },
  {
    title: "Sandboxed by default",
    description:
      "Agents run in isolated environments. Network, file and tool access is declared in the manifest and validated at install time.",
    icon: Shield,
  },
  {
    title: "Semver, but for agents",
    description:
      "Pin a version. Roll back instantly. Read changelogs that explain how the agent's behavior changed between versions.",
    icon: GitBranch,
  },
  {
    title: "Built around a community",
    description:
      "Read field reports from people running the agent in production. Follow authors, watch tutorials. The marketplace is also a social network.",
    icon: Users,
  },
  {
    title: "Workflows or autonomous",
    description:
      "Publish a deterministic workflow with predictable steps, or a fully autonomous agent that builds its own plan. Both share the same packaging contract.",
    icon: Zap,
  },
  {
    title: "SDKs for any environment",
    description:
      "Build agents in TypeScript, Python or Rust. Bring your own LLM provider. Odin handles distribution, signing and updates.",
    icon: Code,
  },
]

export function HowItWorks() {
  return (
    <div id="how-it-works" className="flex scroll-mt-28 flex-col items-center gap-10">
      <SectionHeader
        eyebrow="HOW IT WORKS"
        title="Think of agents as packages."
        description="Standard manifests. Semantic versions. Signed publishers. Sandboxed execution. Everything you expect from a modern package ecosystem — applied to autonomous agents."
      />

      <div className="relative grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
        {features.map(({ title, description, icon: Icon }, index) => (
          <ScrollReveal key={title} delay={index * 80}>
            <SpotlightPanel className="group flex h-full flex-col gap-5 rounded-2xl border border-muted/40 bg-background-100 p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 sm:p-8">
              <div className="flex items-center gap-3">
                <IconTile icon={Icon} className="transition-transform group-hover:scale-105" />
                <span className="font-mono text-xs text-muted-foreground/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </SpotlightPanel>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
