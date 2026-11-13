import Link from "next/link"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { ExternalLink, Plus, Rocket, User } from "lucide-react"

import { getCreatorAgents, getMarketplaceAgents } from "@/lib/api/agents"
import { getCurrentUser } from "@/lib/auth/current-user"
import { accountDisplay, PROFILE_NOTES } from "@/lib/api/profile"
import { creatorHref } from "@/lib/agents/creator"
import { buildMockDashboard } from "@/lib/dashboard/mock"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IconTile } from "@/components/shared/icon-tile"
import { ScrollReveal } from "@/components/motion/scroll-reveal"
import { DashboardView } from "@/components/dashboard/dashboard-view"
import { Library } from "@/components/profile/library"
import { SettingsPanel } from "@/components/profile/settings-panel"
import { SubmissionsPanel } from "@/components/profile/submissions-panel"
import { DevMark } from "@/components/dev/dev-mark"

export const metadata: Metadata = {
  title: "Profile — Odin",
  description: "The creators you follow, the agents you like and save, the analytics of the ones you published, and your account settings.",
}

const TABS = [
  { id: "library", label: "Library" },
  { id: "creator", label: "Creator dashboard" },
  { id: "settings", label: "Settings" },
] as const

type TabId = (typeof TABS)[number]["id"]

function parseTab(value: string | string[] | undefined): TabId {
  return TABS.find((tab) => tab.id === value)?.id ?? "library"
}

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  const account = await getCurrentUser()
  // Le proxy redirige déjà sans cookie ; ici on couvre un cookie présent mais illisible.
  if (!account) redirect("/login?next=/profile")
  const display = accountDisplay(account)

  const tab = parseTab((await searchParams).tab)
  const [published, catalog] = await Promise.all([getCreatorAgents(account.id), getMarketplaceAgents()])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <ScrollReveal className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-4">
          <span className="inline-flex size-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-orange-400 text-primary-foreground shadow-lg shadow-primary/20">
            <User className="size-7" />
          </span>
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
              <span className="truncate">{display.title}</span>
              {!display.complete && <DevMark kind="missing" note={PROFILE_NOTES.identity} />}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {display.handle && <span className="font-mono text-foreground/80">{display.handle} · </span>}
              {published.length === 0
                ? "No agent published yet"
                : `Creator of ${published.length} agent${published.length === 1 ? "" : "s"}`}
            </p>
            {account.bio && <p className="mt-2 max-w-xl text-sm text-foreground/80">{account.bio}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" render={<Link href={creatorHref(account.id)} />}>
            <ExternalLink /> Public profile
          </Button>
          <Button render={<Link href="/publish" />}>
            <Plus /> Publish an agent
          </Button>
        </div>
      </ScrollReveal>

      <nav aria-label="Profile sections" className="flex gap-6 overflow-x-auto border-b border-border/60 [scrollbar-width:none]">
        {TABS.map((item) => (
          <Link
            key={item.id}
            href={item.id === "library" ? "/profile" : `/profile?tab=${item.id}`}
            aria-current={tab === item.id ? "page" : undefined}
            scroll={false}
            className={cn(
              "-mb-px flex shrink-0 items-center gap-2 border-b-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors",
              tab === item.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
            {item.id === "creator" && (
              <span className="rounded-full bg-muted/15 px-1.5 py-0.5 font-mono text-[10px] leading-none tabular-nums">
                {published.length}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {tab === "library" && <Library catalog={catalog} />}

      {tab === "creator" && (
        <div className="flex flex-col gap-8">
          <SubmissionsPanel />
          {published.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-muted/50 px-6 py-16 text-center">
              <IconTile icon={Rocket} />
              <h2 className="text-xl font-bold text-foreground">No agent published yet</h2>
              <p className="max-w-md text-muted-foreground">
                Once your first agent passes the security review and lands on the marketplace, its installs, likes and
                errors show up here.
              </p>
              <Button render={<Link href="/publish" />}>Publish your first agent</Button>
            </div>
          ) : (
            // Pas de ScrollReveal ici : sur mobile, un bloc aussi haut n'atteint jamais son seuil de visibilité.
            <DashboardView data={buildMockDashboard(published)} />
          )}
        </div>
      )}

      {tab === "settings" && <SettingsPanel user={account} />}
    </div>
  )
}
