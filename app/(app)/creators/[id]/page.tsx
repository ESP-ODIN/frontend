import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ArrowLeft, Boxes, CalendarDays, Download, User, Users } from "lucide-react"

import { getCreatorAgents } from "@/lib/api/agents"
import { CREATOR_PROFILE_NOTE, getCreatorProfile } from "@/lib/api/creators"
import { getSessionAccount } from "@/lib/auth/session"
import { shortCreatorId, UUID_RE } from "@/lib/agents/creator"
import { AGENT_TYPE_OPTIONS } from "@/lib/publish/constants"
import { formatCompactCount } from "@/lib/format/count"
import { Button } from "@/components/ui/button"
import { AgentCard } from "@/components/agent/agent-card"
import { ScrollReveal } from "@/components/motion/scroll-reveal"
import { DevMark } from "@/components/dev/dev-mark"
import { FollowCreatorButton } from "@/components/creator/follow-creator-button"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const profile = UUID_RE.test(id) ? await getCreatorProfile(id) : null
  return {
    title: `${profile?.username ? `@${profile.username}` : `Creator ${shortCreatorId(id)}`} — Odin`,
    description: profile?.bio ?? "Agents published by this creator on the Odin marketplace.",
  }
}

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" })

/** Profil public d'un créateur : ses agents publiés, avec des stats tirées de l'API catalogue. */
export default async function Page({ params }: PageProps) {
  const { id } = await params
  if (!UUID_RE.test(id)) notFound()

  const [agents, account, profile] = await Promise.all([getCreatorAgents(id), getSessionAccount(), getCreatorProfile(id)])
  const isMe = account?.id === id
  // Le profil (GET /catalog/creators/:id) prime ; à défaut, ce que les agents renvoient.
  const username = profile?.username ?? agents.find((agent) => agent.creator_username)?.creator_username
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    agents.find((agent) => agent.creator_name)?.creator_name

  const installs = agents.reduce((sum, agent) => sum + agent.downloads_count, 0)
  const firstPublished = agents
    .map((agent) => agent.created_at)
    .filter((date): date is string => !!date)
    .sort()[0]
  const typeCounts = AGENT_TYPE_OPTIONS.map((option) => ({
    ...option,
    count: agents.filter((agent) => agent.agent_type === option.id).length,
  })).filter((option) => option.count > 0)

  const facts = [
    { icon: Boxes, label: `${agents.length} agent${agents.length === 1 ? "" : "s"} published` },
    { icon: Download, label: `${formatCompactCount(installs)} installs` },
    ...(profile?.followersCount !== undefined
      ? [{ icon: Users, label: `${formatCompactCount(profile.followersCount)} follower${profile.followersCount === 1 ? "" : "s"}` }]
      : []),
    ...(profile?.createdAt
      ? [{ icon: CalendarDays, label: `Joined ${monthFormatter.format(new Date(profile.createdAt))}` }]
      : firstPublished
        ? [{ icon: CalendarDays, label: `Publishing since ${monthFormatter.format(new Date(firstPublished))}` }]
        : []),
  ]

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      {isMe && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm">
          <p className="text-foreground">This is how other people see your profile.</p>
          <Button variant="outline" size="sm" render={<Link href="/profile" />}>
            <ArrowLeft /> Back to my profile
          </Button>
        </div>
      )}

      <ScrollReveal className="flex flex-col gap-5">
        <div className="flex min-w-0 flex-wrap items-center gap-4">
          <span className="inline-flex size-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-orange-400 text-primary-foreground shadow-lg shadow-primary/20">
            <User className="size-7" />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">Creator</p>
            <h1 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
              <span className="truncate font-mono">{username ? `@${username}` : shortCreatorId(id)}</span>
              {!profile && <DevMark kind="missing" note={CREATOR_PROFILE_NOTE} />}
            </h1>
            {fullName && <p className="text-muted-foreground">{fullName}</p>}
          </div>
          {!isMe && <FollowCreatorButton creatorId={id} isLoggedIn={!!account} className="ml-auto" />}
        </div>

        {profile?.bio && <p className="max-w-2xl text-foreground/80">{profile.bio}</p>}

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {facts.map((fact) => (
            <li key={fact.label} className="flex items-center gap-1.5">
              <fact.icon aria-hidden className="size-4 text-primary opacity-80" />
              {fact.label}
            </li>
          ))}
          {typeCounts.map((type) => (
            <li key={type.id} className="flex items-center gap-1.5">
              <type.icon aria-hidden className="size-4 text-primary opacity-80" />
              {type.count} {type.label.toLowerCase()}
            </li>
          ))}
        </ul>
      </ScrollReveal>

      <section className="flex flex-col gap-4" aria-labelledby="creator-agents">
        <h2 id="creator-agents" className="font-semibold text-foreground">Published agents</h2>
        {agents.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-muted/50 px-6 py-14 text-center">
            <Boxes aria-hidden className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground">
              {isMe ? "You haven't published any agent yet." : "This creator hasn't published any agent yet."}
            </p>
            <Button variant="outline" render={<Link href={isMe ? "/publish" : "/marketplace"} />}>
              {isMe ? "Publish an agent" : "Browse the marketplace"}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
