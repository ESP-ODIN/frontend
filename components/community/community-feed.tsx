"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Inbox, PenLine, Search, X } from "lucide-react"

import type { Agent } from "@/lib/agents/types"
import type { Creator } from "@/lib/agents/creator"
import { cn } from "@/lib/utils"
import { getFollowedCreators } from "@/lib/api/creator-follows"
import { kindFromTag, POST_KINDS, toTag } from "@/lib/social/content"
import { DEMO_NOTE } from "@/lib/social/demo"
import {
  FEED_TABS,
  filterFeed,
  popularTags,
  withParsed,
  type FeedTab,
  type ParsedFeedPost,
} from "@/lib/social/feed"
import { readSavedPosts, writeSavedPosts } from "@/lib/social/saved"
import {
  createPostAction,
  deletePostAction,
  loadFeedAction,
  setPostLikeAction,
} from "@/lib/social/actions"
import type { FeedPost, FeedResult, PostKind } from "@/lib/social/types"
import { Composer, type ComposerHandle } from "@/components/community/composer"
import { FeedNav } from "@/components/community/feed-nav"
import { FeedSidebar } from "@/components/community/feed-sidebar"
import { FeedSkeleton } from "@/components/community/feed-skeleton"
import { PostCard } from "@/components/community/post-card"
import { DevMark } from "@/components/dev/dev-mark"

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

type CommunityFeedProps = {
  me: { id: string; label: string } | null
  agents: Agent[]
  creators: Creator[]
}

export function CommunityFeed({ me, agents, creators }: CommunityFeedProps) {
  const searchParams = useSearchParams()
  const highlightedId = searchParams.get("post")

  const [result, setResult] = useState<FeedResult | null>(null)
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [followedIds, setFollowedIds] = useState<string[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [tab, setTab] = useState<FeedTab>("for-you")
  const [kind, setKind] = useState<PostKind | null>(null)
  const [tag, setTag] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  /** Posts publiés depuis cette page : épinglés en tête pour voir tout de suite le sien. */
  const [pinnedIds, setPinnedIds] = useState<string[]>([])
  const composerRef = useRef<ComposerHandle>(null)
  const toolbarSentinel = useRef<HTMLDivElement>(null)
  const [toolbarStuck, setToolbarStuck] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const loadId = useRef(0)

  const isDemo = result?.source === "demo"

  const load = useCallback(async () => {
    const id = ++loadId.current
    const followed = Object.keys(await getFollowedCreators())
    const next = await loadFeedAction(followed).catch((): FeedResult => ({
      source: "api",
      posts: [],
      meId: me?.id ?? null,
      notice: "Unable to load the feed.",
    }))
    if (id !== loadId.current) return
    setFollowedIds(followed)
    setResult(next)
    setPosts(next.posts)
  }, [me?.id])

  // La barre de recherche se détache (ombre, flou) quand elle colle en haut de l'écran.
  useEffect(() => {
    const node = toolbarSentinel.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setToolbarStuck(!entry.isIntersecting),
      { rootMargin: "-112px 0px 0px 0px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setSavedIds(readSavedPosts())
    void load()
  }, [load])

  // Raccourcis : "n" écrit un post, "/" cherche, Échap vide les filtres.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (target.closest("input, textarea, [contenteditable]")) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === "n") {
        event.preventDefault()
        composerRef.current?.focus()
      } else if (event.key === "/") {
        event.preventDefault()
        searchRef.current?.focus()
      } else if (event.key === "Escape") {
        setTag(null)
        setKind(null)
        setQuery("")
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const parsed = useMemo(() => withParsed(posts), [posts])
  const visible = useMemo(() => {
    const filtered = filterFeed(parsed, { tab, kind, tag, query, savedIds })
    if (tab !== "for-you" || pinnedIds.length === 0) return filtered
    const pinned = new Set(pinnedIds)
    return [
      ...filtered.filter((post) => pinned.has(post.id)),
      ...filtered.filter((post) => !pinned.has(post.id)),
    ]
  }, [parsed, tab, kind, tag, query, savedIds, pinnedIds])
  const tags = useMemo(() => popularTags(parsed), [parsed])

  const agentsByTag = useMemo(
    () => new Map(agents.map((agent) => [toTag(agent.name), agent])),
    [agents]
  )
  const creatorsById = useMemo(
    () => new Map(creators.map((creator) => [creator.id, creator])),
    [creators]
  )

  const counts = useMemo(
    () => ({
      "for-you": parsed.length,
      following: parsed.filter((post) => post.reason === "following").length,
      saved: parsed.filter((post) => savedIds.has(post.id)).length,
    }),
    [parsed, savedIds]
  )

  const followed = followedIds.map((id) => {
    const creator = creatorsById.get(id)
    return {
      id,
      label:
        creator?.name ||
        (creator?.username ? `@${creator.username}` : id.split("-")[0]),
    }
  })

  const popularAgents = useMemo(
    () =>
      [...agents]
        .sort((a, b) => b.downloads_count - a.downloads_count)
        .slice(0, 5),
    [agents]
  )
  const newAgents = useMemo(() => {
    const weekAgo = Date.now() - WEEK_MS
    return agents
      .filter(
        (agent) =>
          agent.created_at && new Date(agent.created_at).getTime() >= weekAgo
      )
      .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
      .slice(0, 4)
  }, [agents])
  const suggestedCreators = useMemo(() => {
    const followedSet = new Set(followedIds)
    return creators
      .filter(
        (creator) => creator.id !== me?.id && !followedSet.has(creator.id)
      )
      .sort((a, b) => b.installs - a.installs || b.agentCount - a.agentCount)
      .slice(0, 4)
  }, [creators, followedIds, me?.id])

  function selectTag(value: string) {
    const tagKind = kindFromTag(value)
    if (tagKind) {
      setKind((current) => (current === tagKind ? null : tagKind))
      return
    }
    setTag((current) => (current === value ? null : value))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function toggleSave(postId: string) {
    setSavedIds((current) => {
      const next = new Set(current)
      if (next.has(postId)) next.delete(postId)
      else next.add(postId)
      writeSavedPosts(next)
      return next
    })
  }

  function patchPost(postId: string, patch: (post: FeedPost) => FeedPost) {
    setPosts((current) =>
      current.map((post) => (post.id === postId ? patch(post) : post))
    )
  }

  async function toggleLike(post: ParsedFeedPost) {
    const liked = !post.likedByMe
    const apply = (value: boolean) =>
      patchPost(post.id, (item) => ({
        ...item,
        likedByMe: value,
        likeCount: Math.max(0, item.likeCount + (value ? 1 : -1)),
      }))
    apply(liked)
    if (isDemo) return
    const response = await setPostLikeAction(post.id, liked)
    if (!response.ok) {
      apply(!liked)
      setError(response.error)
    }
  }

  async function submitPost(input: {
    content: string
    mediaUrl?: string
  }): Promise<string | null> {
    if (isDemo || !me) {
      const local: FeedPost = {
        id: `local-${Date.now()}`,
        author: { id: me?.id ?? "me", label: me?.label ?? "You", known: true },
        content: input.content,
        mediaUrl: input.mediaUrl ?? null,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        likedByMe: false,
        reason: "mine",
      }
      setPosts((current) => [local, ...current])
      setPinnedIds((current) => [local.id, ...current])
      setTab("for-you")
      return null
    }
    const response = await createPostAction(input)
    if (!response.ok) return response.error
    setPosts((current) => [response.data, ...current])
    setPinnedIds((current) => [response.data.id, ...current])
    setTab("for-you")
    setKind(null)
    setTag(null)
    return null
  }

  async function removePost(postId: string): Promise<boolean> {
    if (!isDemo && !postId.startsWith("local-")) {
      const response = await deletePostAction(postId)
      if (!response.ok) {
        setError(response.error)
        return false
      }
    }
    setPosts((current) => current.filter((post) => post.id !== postId))
    return true
  }

  const activeFilters = Boolean(kind || tag || query)
  const tabInfo = FEED_TABS.find((item) => item.id === tab)!

  // Colonnes latérales de même largeur (1fr) : le feed reste dans l'axe de la navbar.
  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,640px)_minmax(0,1fr)] lg:gap-8">
      <div className="lg:sticky lg:top-28 lg:w-full lg:max-w-52 lg:self-start lg:justify-self-end">
        <FeedNav
          tab={tab}
          counts={counts}
          onTabChange={setTab}
          followed={followed}
        />
      </div>

      <main className="flex min-w-0 flex-col gap-4">
        <Composer
          ref={composerRef}
          me={me}
          agents={agents}
          suggestedTags={tags.map((item) => item.tag)}
          onSubmit={submitPost}
        />

        <div ref={toolbarSentinel} aria-hidden className="-mb-4 h-0" />
        <div
          className={cn(
            "sticky top-20 z-20 flex flex-col gap-3 rounded-2xl border transition-[background-color,border-color,box-shadow,padding] duration-300 sm:top-24",
            toolbarStuck
              ? "border-muted/30 bg-background-100/85 p-3 shadow-xl ring-1 shadow-black/[0.06] ring-black/[0.02] backdrop-blur-xl"
              : "border-transparent px-0 py-1"
          )}
        >
          <div className="flex items-center gap-2">
            <label className="relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search posts, people, #tags…"
                aria-label="Search the feed"
                className="h-10 w-full rounded-xl border border-muted/30 bg-background-100 pr-3 pl-9 text-sm transition-colors outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5"
              />
            </label>
            {toolbarStuck && me && (
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" })
                  setTimeout(() => composerRef.current?.focus(), 350)
                }}
                className="inline-flex h-10 shrink-0 animate-in items-center gap-1.5 rounded-xl bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 transition-transform duration-300 fade-in-0 zoom-in-90 hover:bg-primary/90 active:scale-95"
              >
                <PenLine className="size-4" />
                <span className="hidden sm:inline">New post</span>
              </button>
            )}
          </div>

          <div className="-mx-1 flex [scrollbar-width:none] items-center gap-1.5 overflow-x-auto px-1">
            <button
              type="button"
              aria-pressed={!kind}
              onClick={() => setKind(null)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all",
                !kind
                  ? "bg-foreground text-background"
                  : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              All
            </button>
            {POST_KINDS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={kind === option.id}
                onClick={() =>
                  setKind((current) =>
                    current === option.id ? null : option.id
                  )
                }
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all",
                  kind === option.id
                    ? "bg-foreground text-background"
                    : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                {option.filterLabel}
              </button>
            ))}
            {tag && (
              <span className="inline-flex shrink-0 animate-in items-center gap-1 rounded-full bg-primary py-1 pr-1 pl-3 font-mono text-xs text-primary-foreground zoom-in-90">
                #{tag}
                <button
                  type="button"
                  aria-label="Clear the tag filter"
                  onClick={() => setTag(null)}
                  className="rounded-full p-0.5 hover:bg-white/20"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}
          </div>
        </div>

        {(isDemo || result?.notice || error) && (
          <div
            className={cn(
              "flex animate-in items-center gap-2 rounded-xl px-4 py-2.5 text-sm fade-in-0",
              error
                ? "bg-destructive/10 text-destructive"
                : "bg-amber-400/10 text-amber-800 dark:text-amber-300"
            )}
          >
            {isDemo && <DevMark kind="mock" note={DEMO_NOTE} />}
            <span className="flex-1">{error ?? result?.notice}</span>
            {error && (
              <button
                type="button"
                onClick={() => setError(null)}
                aria-label="Dismiss"
                className="rounded p-0.5 hover:bg-destructive/10"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        )}

        {result === null ? (
          <FeedSkeleton />
        ) : result.source === "signed-out" ? (
          <EmptyState
            title="Your timeline lives here"
            text="Sign in to see posts from the creators you follow and recommendations picked for you."
          />
        ) : visible.length === 0 ? (
          <EmptyState
            title={
              activeFilters ? "Nothing matches these filters" : emptyTitle(tab)
            }
            text={
              activeFilters
                ? "Try another tag or clear the search."
                : tabInfo.description
            }
            action={
              activeFilters
                ? {
                    label: "Clear filters",
                    onClick: () => (setKind(null), setTag(null), setQuery("")),
                  }
                : tab !== "for-you"
                  ? {
                      label: "Back to For you",
                      onClick: () => setTab("for-you"),
                    }
                  : {
                      label: "Write the first post",
                      onClick: () => composerRef.current?.focus(),
                    }
            }
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {visible.map((post, i) => (
              <li
                key={post.id}
                className="animate-in duration-500 fade-in-0 fill-mode-both slide-in-from-bottom-3"
                style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
              >
                <PostCard
                  post={post}
                  isMine={
                    Boolean(me && post.author.id === me.id) ||
                    post.reason === "mine"
                  }
                  saved={savedIds.has(post.id)}
                  highlighted={post.id === highlightedId}
                  agentsByTag={agentsByTag}
                  onLike={toggleLike}
                  onToggleSave={toggleSave}
                  onDelete={removePost}
                  onTagClick={selectTag}
                />
              </li>
            ))}
            <li className="py-6 text-center font-mono text-xs text-muted-foreground">
              You&apos;re all caught up ✦
            </li>
          </ul>
        )}
      </main>

      <div className="hidden [scrollbar-width:none] overscroll-contain xl:sticky xl:top-28 xl:block xl:max-h-[calc(100dvh-8rem)] xl:w-full xl:max-w-[300px] xl:self-start xl:justify-self-start xl:overflow-y-auto xl:pb-4 [&::-webkit-scrollbar]:hidden">
        <FeedSidebar
          popularAgents={popularAgents}
          newAgents={newAgents}
          suggestedCreators={suggestedCreators}
          tags={tags}
          activeTag={tag}
          onTagClick={selectTag}
          isLoggedIn={Boolean(me)}
          onFollowChange={() => void load()}
        />
      </div>
    </div>
  )
}

function emptyTitle(tab: FeedTab): string {
  if (tab === "following") return "No posts from people you follow yet"
  if (tab === "saved") return "No saved posts"
  return "The feed is quiet"
}

function EmptyState({
  title,
  text,
  action,
}: {
  title: string
  text: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="flex animate-in flex-col items-center gap-3 rounded-2xl border border-dashed border-muted/40 px-6 py-14 text-center duration-500 fade-in-0 zoom-in-95">
      <span className="relative flex">
        <span
          aria-hidden
          className="fx-pulse-ring absolute inset-0 rounded-2xl bg-primary/20"
        />
        <span className="relative flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Inbox className="size-5" />
        </span>
      </span>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-1 rounded-full border border-muted/40 px-4 py-1.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
