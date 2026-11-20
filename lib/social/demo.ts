import type { FeedPost } from "@/lib/social/types"

/**
 * Posts de démonstration, affichés quand l'API social n'est pas joignable (SOCIAL_API_URL absent ou
 * service arrêté). Jamais envoyés à l'API.
 */
export const DEMO_NOTE =
  "demo posts: the social API is unreachable (SOCIAL_API_URL), nothing here is stored and likes stay in this tab"

const HOUR = 60 * 60 * 1000

const authors = {
  maelys: {
    id: "demo-maelys",
    label: "Maëlys D.",
    handle: "maelys_d",
    known: true,
  },
  kevin: {
    id: "demo-kevin",
    label: "Kevin L.",
    handle: "kevinl_dev",
    known: true,
  },
  thierry: {
    id: "demo-thierry",
    label: "Thierry B.",
    handle: "thierry_b",
    known: true,
  },
  clara: {
    id: "demo-clara",
    label: "Clara M.",
    handle: "clara_m",
    known: true,
  },
  anouar: {
    id: "demo-anouar",
    label: "Anouar K.",
    handle: "anouar_k",
    known: true,
  },
  sophie: {
    id: "demo-sophie",
    label: "Sophie W.",
    handle: "sophie_w",
    known: true,
  },
}

const raw: (Omit<FeedPost, "createdAt" | "likedByMe"> & {
  hoursAgo: number
})[] = [
  {
    id: "demo-1",
    author: authors.maelys,
    hoursAgo: 2,
    likeCount: 142,
    reason: "following",
    mediaUrl: null,
    content:
      "3 weeks of code-reviewer in CI — what we learned about token costs\n\nWe moved our review pipeline to code-reviewer in May. Here's the field report on real savings, the surprises between v2.3 and v2.4, and our final config for a 200k-line TypeScript monorepo.\n\nTL;DR: batch the diff by package, cap the context at 40k tokens and let the agent skip generated files. Our bill dropped by 61%.\n\n#rex #code-reviewer #ci #cost-optimization #typescript",
  },
  {
    id: "demo-2",
    author: authors.kevin,
    hoursAgo: 5,
    likeCount: 89,
    reason: "recommended",
    mediaUrl: null,
    content:
      "Building a tech-watch agent with the Odin SDK + HN + arXiv\n\nStep-by-step tutorial: an agent that pulls Hacker News posts and arXiv papers, ranks them by relevance and sends a daily digest. Source code included.\n\n#tutorial #sdk #rss",
  },
  {
    id: "demo-3",
    author: authors.thierry,
    hoursAgo: 7,
    likeCount: 23,
    reason: "following",
    mediaUrl: null,
    content:
      "sql-analyst v0.9.4 — Snowflake auth broken after the update?\n\nSince the update, sql-analyst can't connect to Snowflake anymore: 403 during the OAuth handshake. Has anyone found a workaround while waiting for the patch?\n\n#faq #sql-analyst #bug #snowflake #auth",
  },
  {
    id: "demo-4",
    author: authors.clara,
    hoursAgo: 12,
    likeCount: 64,
    reason: "recommended",
    mediaUrl: null,
    content:
      "odin-watchdog — an agent that monitors your agents in production\n\nAfter 6 months of heavy use I ended up building an agent that watches the others: latency, error rate, behavioural drift. Available on Odin since this morning.\n\n#odin-watchdog #monitoring #production",
  },
  {
    id: "demo-5",
    author: authors.anouar,
    hoursAgo: 26,
    likeCount: 51,
    reason: "following",
    mediaUrl: null,
    content:
      "400 meetings transcribed — 3 months with meeting-scribe\n\nAn honest review after rolling out meeting-scribe to the whole product team: what really works, what disappoints, and the config we settled on.\n\n#rex #meeting-scribe #voice #productivity",
  },
  {
    id: "demo-6",
    author: authors.sophie,
    hoursAgo: 49,
    likeCount: 37,
    reason: "recommended",
    mediaUrl: null,
    content:
      "Running several agents in parallel with Odin Workspaces\n\nWorkspaces let you treat a group of agents as one coherent unit — same versioning, same sandbox, one manifest. Here's our data-engineering setup.\n\n#tutorial #workspaces #data",
  },
]

export function getDemoPosts(): FeedPost[] {
  const now = Date.now()
  return raw.map(({ hoursAgo, ...post }) => ({
    ...post,
    likedByMe: false,
    createdAt: new Date(now - hoursAgo * HOUR).toISOString(),
  }))
}
