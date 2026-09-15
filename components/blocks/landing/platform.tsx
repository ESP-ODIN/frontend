import Link from "next/link"

import { cn } from "@/lib/utils"
import { AgentListItem } from "@/components/blocks/agent-list-item"
import { Badge } from "@/components/blocks/badge"
import { SectionHeader } from "@/components/blocks/landing/section-header"
import { agents } from "@/lib/data/agents"

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
  badge: "REX" | "TUTORIAL" | "QUESTION"
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
    badge: "REX",
    badgeVariant: "primary",
    text: "3 semaines de code-reviewer en CI — ce qu'on a appris sur les coûts token",
    avatarBg: "bg-primary/10 text-primary",
  },
  {
    initials: "KL",
    name: "Kevin L.",
    handle: "@kevinl_dev",
    time: "5h",
    badge: "TUTORIAL",
    badgeVariant: "inverted",
    text: "Builder un agent de veille techno avec l'Odin SDK + HN + arXiv",
    avatarBg: "bg-amber-100 text-amber-900",
  },
  {
    initials: "TB",
    name: "Thierry B.",
    handle: "@thierry_b",
    time: "7h",
    badge: "QUESTION",
    badgeVariant: "muted",
    text: "sql-analyst v0.9.4 — auth Snowflake cassée après la mise à jour ?",
    avatarBg: "bg-blue-100 text-blue-900",
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
    <div className="flex flex-col gap-6 rounded-2xl border border-muted/40 p-8">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-mono tracking-wider text-primary">{eyebrow}</p>
        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {children}

      <Link href={href} className="mt-auto text-sm font-bold text-primary hover:underline">
        {cta} →
      </Link>
    </div>
  )
}

type PlatformProps = {
  className?: string
}

export function Platform({ className }: PlatformProps) {
  return (
    <div className={cn("flex flex-col items-center gap-10", className)}>
      <SectionHeader
        eyebrow="LA PLATEFORME"
        title="Trois surfaces, un seul écosystème."
        description="L'interface en ligne de commande (CLI) permet d'exécuter les agents. La place de marché permet de les trouver. La communauté permet à l'écosystème de s'améliorer, un REX à la fois."
      />

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
        <SurfaceCard
          eyebrow="CLI"
          title="Gestionnaire d'agents"
          description="Un seul fichier binaire. Installation, mise à jour, exécution, audit. Fonctionne sous Linux, macOS et Windows."
          href="/docs"
          cta="Consultez la documentation"
        >
          <div className="flex flex-col gap-1.5 rounded-xl bg-muted/10 p-4 font-mono text-[13px] leading-6">
            {cliLines.map((line) => (
              <p key={line.text} className={cn(line.kind === "output" && "text-muted-foreground")}>
                <span className={cn(line.kind === "command" ? "text-primary" : "text-muted-foreground")}>
                  {line.kind === "command" ? "$ " : "→ "}
                </span>
                {line.text}
              </p>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard
          eyebrow="BOUTIQUE"
          title="Découvrir et évaluer des agents"
          description="Consultez les journaux de modifications, vérifiez les autorisations, comparez les versions"
          href="/marketplace"
          cta="Parcourir la boutique"
        >
          <div className="flex flex-col gap-2 rounded-xl border border-muted/40 p-2">
            {agents.slice(0, 3).map((agent) => (
              <AgentListItem key={agent.slug} agent={agent} />
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard
          eyebrow="RÉSEAU SOCIAL"
          title="REX, tutoriels, feed"
          description="Inspirez-vous des opérateurs qui gèrent des agents à grande échelle. Partagez des configurations, publiez des tutoriels, suivez les auteurs."
          href="/community"
          cta="Rejoignez la communauté"
        >
          <div className="flex flex-col divide-y divide-muted/40 rounded-xl border border-muted/40">
            {feed.slice(0, 2).map((post) => (
              <div key={post.handle} className="flex flex-col gap-2 p-3">
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
      </div>
    </div>
  )
}
