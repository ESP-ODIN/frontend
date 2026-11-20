import { Suspense } from "react"
import type { Metadata } from "next"

import { getMarketplaceAgents } from "@/lib/api/agents"
import { collectCreators } from "@/lib/agents/creator"
import { getCurrentUser } from "@/lib/auth/current-user"
import { CommunityHero } from "@/components/community/community-hero"
import { CommunityFeed } from "@/components/community/community-feed"
import { FeedSkeleton } from "@/components/community/feed-skeleton"

export const metadata: Metadata = {
  title: "Community — Odin",
  description:
    "Field reports, tutorials and questions from the Odin community.",
}

export default async function Page() {
  const [agents, user] = await Promise.all([
    getMarketplaceAgents().catch(() => []),
    getCurrentUser(),
  ])
  const creators = collectCreators(agents)

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ")
  const me = user
    ? {
        id: user.id,
        label:
          fullName ||
          (user.username ? `@${user.username}` : (user.email ?? "You")),
      }
    : null

  return (
    <div className="flex w-full flex-col gap-8 pb-16">
      <CommunityHero />
      {/* Le layout racine plafonne à max-w-7xl : le feed en sort pour que ses trois colonnes tiennent,
          centré sur l'écran comme la navbar. */}
      <div className="relative left-1/2 w-[min(calc(100vw-2rem),1400px)] -translate-x-1/2 sm:w-[min(calc(100vw-3rem),1400px)]">
        <Suspense fallback={<FeedSkeleton />}>
          <CommunityFeed me={me} agents={agents} creators={creators} />
        </Suspense>
      </div>
    </div>
  )
}
