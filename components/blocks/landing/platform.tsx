import Link from "next/link"

import { cn } from "@/lib/utils"
import { AgentListItem } from "@/components/blocks/agent-list-item"
import { Badge } from "@/components/blocks/badge"
import { agents } from "@/lib/data/agents"
import { SectionHeader } from "@/components/blocks/landing/section-header"
import { SpotlightPanel } from "@/components/motion/spotlight-panel"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

type CliLine = {
  kind: "command" | "output"
  text: string
}

const cliLines: CliLine[] = [
  { kind: "command", text: "odin install code-reviewer" },
  { kind: "output", text: "installed in 1.2s" },
  { kind: "command", text: "odin run code-reviewer" },
  { kind: "output", text: "3 suggestions found" },
  { kind: "command", text: "odin update --all" },
  { kind: "output", text: "4 packages upgraded" },
]

type FeedPost = {
  initials: string
  name: string
  handle: string
  time: string
  badge: "REPORT" | "TUTORIAL" | "QUESTION"
  badgeVariant: "primary" | "inverted" | "muted"
  text: string
  avatarBg: string
}

const feed: FeedPost[] = [
  {
    initials: "MD",
    name: "Maëlys D.",
    handle: "@maelys_d",
    time: "2h",
    badge: "REPORT",
    badgeVariant: "primary",
    text: "3 weeks of code-reviewer in CI — what we learned about token costs",
    avatarBg: "bg-primary/10 text-primary",
  },
  {
    initials: "KL",
    name: "Kevin L.",
    handle: "@kevinl_dev",
    time: "5h",
    badge: "TUTORIAL",
    badgeVariant: "inverted",
    text: "Building a tech-watch agent with the Odin SDK + HN + arXiv",
    avatarBg: "bg-amber-100 text-amber-900",
  },
]

type SurfaceCardProps = {
  eyebrow: string
  title: string
  description: string
  href: string
  cta: string
  children: React.ReactNode
}

function SurfaceCard({ eyebrow, title, description, href, cta, children }: SurfaceCardProps) {
  return (
    <SpotlightPanel className="group flex h-full flex-col gap-6 rounded-2xl border border-muted/40 bg-background-100 p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 sm:p-8">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs tracking-wider text-primary">{eyebrow}</p>
        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {children}

      <Link href={href} className="mt-auto flex items-center gap-1 text-sm font-bold text-primary group-hover:underline">
        {cta} →
      </Link>
    </SpotlightPanel>
  )
}

export function Platform() {
  return (
    <div id="platform" className="flex scroll-mt-28 flex-col items-center gap-10">
      <SectionHeader
        eyebrow="THE PLATFORM"
        title="Three surfaces, one ecosystem."
        description="The command line interface (CLI) runs agents. The marketplace helps you find them. The community makes the ecosystem better, one field report at a time."
      />

      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
        <ScrollReveal delay={0}>
          <SurfaceCard
            eyebrow="CLI"
            title="Agent manager"
            description="A single binary. Install, update, run, audit. Works on Linux, macOS and Windows."
            href="/docs"
            cta="Read the docs"
          >
            <div className="flex flex-col gap-1.5 rounded-xl bg-[#141210] p-4 font-mono text-[13px] leading-6">
              {cliLines.map((line) => (
                <p key={line.text} className={cn(line.kind === "output" && "text-white/40")}>
                  <span className={cn(line.kind === "command" ? "text-primary" : "text-white/40")}>
                    {line.kind === "command" ? "$ " : "→ "}
                  </span>
                  <span className={cn(line.kind === "command" && "text-white/80")}>{line.text}</span>
                </p>
              ))}
            </div>
          </SurfaceCard>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <SurfaceCard
            eyebrow="STORE"
            title="Discover and evaluate agents"
            description="Read changelogs, check permissions, compare versions"
            href="/marketplace"
            cta="Browse the store"
          >
            <div className="flex flex-col gap-2 rounded-xl border border-muted/40 p-2">
              {agents.slice(0, 3).map((agent) => (
                <AgentListItem key={agent.slug} agent={agent} />
              ))}
            </div>
          </SurfaceCard>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <SurfaceCard
            eyebrow="SOCIAL NETWORK"
            title="Field reports, tutorials, feed"
            description="Learn from operators running agents at scale. Share configurations, publish tutorials, follow authors."
            href="/community"
            cta="Join the community"
          >
            <div className="flex flex-col divide-y divide-muted/40 rounded-xl border border-muted/40">
              {feed.map((post) => (
                <div key={post.handle} className="flex flex-col gap-2 p-3 transition-colors hover:bg-muted/10">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                        post.avatarBg
                      )}
                    >
                      {post.initials}
                    </div>
                    <div className="flex flex-1 items-baseline gap-1.5 truncate">
                      <p className="text-sm font-bold text-foreground">{post.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {post.handle} · {post.time}
                      </p>
                    </div>
                    <Badge variant={post.badgeVariant} size="sm" className="shrink-0">
                      {post.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground">{post.text}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </ScrollReveal>
      </div>
    </div>
  )
}
