import { kindFromTag, parsePost, type ParsedPost } from "@/lib/social/content"
import type { FeedPost, PostKind } from "@/lib/social/types"

export type FeedTab = "for-you" | "following" | "saved"

export const FEED_TABS: { id: FeedTab; label: string; description: string }[] =
  [
    {
      id: "for-you",
      label: "For you",
      description: "People you follow and creators we think you'll like",
    },
    {
      id: "following",
      label: "Following",
      description: "Only people you follow, newest first",
    },
    { id: "saved", label: "Saved", description: "Posts you bookmarked" },
  ]

const HOUR = 60 * 60 * 1000

export type ParsedFeedPost = FeedPost & { parsed: ParsedPost }

export function withParsed(posts: FeedPost[]): ParsedFeedPost[] {
  return posts.map((post) => ({ ...post, parsed: parsePost(post.content) }))
}

/**
 * Score « For you » : likes + bonus si l'auteur est suivi (ou si c'est soi), amorti par l'âge du
 * post (même idée que Hacker News : un post récent remonte, puis redescend).
 */
function forYouScore(post: FeedPost, now: number): number {
  const ageHours = Math.max(
    0,
    (now - new Date(post.createdAt).getTime()) / HOUR
  )
  const boost = post.reason === "following" ? 6 : post.reason === "mine" ? 3 : 0
  return (post.likeCount + boost + 1) / Math.pow(ageHours + 2, 1.3)
}

export type FeedFilters = {
  tab: FeedTab
  kind: PostKind | null
  tag: string | null
  query: string
  savedIds: Set<string>
}

export function filterFeed(
  posts: ParsedFeedPost[],
  filters: FeedFilters
): ParsedFeedPost[] {
  const now = Date.now()
  const query = filters.query.trim().toLowerCase()

  let result = posts.filter((post) => {
    if (filters.tab === "following" && post.reason !== "following") return false
    if (filters.tab === "saved" && !filters.savedIds.has(post.id)) return false
    if (filters.kind && post.parsed.kind !== filters.kind) return false
    if (filters.tag && !post.parsed.tags.includes(filters.tag)) return false
    if (
      query &&
      !`${post.content} ${post.author.label} ${post.author.handle ?? ""}`
        .toLowerCase()
        .includes(query)
    )
      return false
    return true
  })

  if (filters.tab === "for-you") {
    result = [...result].sort(
      (a, b) => forYouScore(b, now) - forYouScore(a, now)
    )
  } else {
    result = [...result].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
  return result
}

/** Tags les plus utilisés dans le feed chargé (hors hashtags de genre). */
export function popularTags(
  posts: ParsedFeedPost[],
  limit = 12
): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.parsed.tags) {
      if (!kindFromTag(tag)) counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, limit)
}
