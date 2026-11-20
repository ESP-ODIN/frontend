"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  Bookmark,
  Check,
  Heart,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Sparkles,
  Trash2,
  UserCheck,
} from "lucide-react"

import type { Agent } from "@/lib/agents/types"
import { cn } from "@/lib/utils"
import { creatorHref } from "@/lib/agents/creator"
import { formatCompactCount } from "@/lib/format/count"
import { formatTimeAgo } from "@/lib/format/time-ago"
import { kindFromTag, POST_KINDS, tokenize } from "@/lib/social/content"
import type { ParsedFeedPost } from "@/lib/social/feed"
import type { PostKind } from "@/lib/social/types"
import { useExplosion } from "@/components/motion/explosion-burst"
import { SpotlightPanel } from "@/components/motion/spotlight-panel"
import { UserAvatar } from "@/components/community/user-avatar"
import { DevMark } from "@/components/dev/dev-mark"

/** « General » n'a pas de badge. */
const KIND_STYLES: Record<Exclude<PostKind, "general">, string> = {
  rex: "bg-primary/10 text-primary ring-primary/20",
  tutorial: "bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-300",
  faq: "bg-amber-400/15 text-amber-800 ring-amber-500/25 dark:text-amber-300",
}

const LIKE_COLORS = ["#f43f5e", "#fb7185", "#fda4af", "#e85d04", "#ffb35c"]
const SAVE_COLORS = ["#e85d04", "#ffb35c", "#ffd8a8", "#fbbf24"]

export const COMMENTS_NOTE =
  "comments: no comment route in the social API (threads belong to the forum ticket ODIN-58)"
export const AUTHOR_NOTE =
  "author: the social API only returns author_id, the start of the id is shown"

/** Rejoue une classe d'animation CSS sur un élément, même si elle est déjà appliquée. */
function replay(node: HTMLElement | null, className: string) {
  if (!node) return
  node.classList.remove(className)
  void node.offsetWidth
  node.classList.add(className)
}

function RichText({
  text,
  onTagClick,
}: {
  text: string
  onTagClick: (tag: string) => void
}) {
  return (
    <>
      {tokenize(text).map((token, i) => {
        if (token.type === "tag")
          return (
            <button
              key={i}
              type="button"
              onClick={() => onTagClick(token.value)}
              className="font-medium text-primary hover:underline"
            >
              #{token.value}
            </button>
          )
        if (token.type === "link")
          return (
            <a
              key={i}
              href={token.value}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
            >
              {token.value.replace(/^https?:\/\//, "")}
            </a>
          )
        return <span key={i}>{token.value}</span>
      })}
    </>
  )
}

function ActionButton({
  label,
  active,
  activeClass,
  onClick,
  children,
  disabled,
  containerRef,
}: {
  label: string
  active?: boolean
  activeClass?: string
  onClick?: () => void
  children: ReactNode
  disabled?: boolean
  containerRef?: React.Ref<HTMLSpanElement>
}) {
  return (
    <span ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full px-3 font-mono text-xs text-muted-foreground transition-[color,background-color,transform] outline-none select-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent [&_svg]:size-4",
          active && activeClass
        )}
      >
        {children}
      </button>
    </span>
  )
}

type PostCardProps = {
  post: ParsedFeedPost
  isMine: boolean
  saved: boolean
  highlighted: boolean
  agentsByTag: Map<string, Agent>
  onLike: (post: ParsedFeedPost) => void
  onToggleSave: (postId: string) => void
  onDelete: (postId: string) => Promise<boolean>
  onTagClick: (tag: string) => void
}

const CLAMP_LENGTH = 320

export function PostCard({
  post,
  isMine,
  saved,
  highlighted,
  agentsByTag,
  onLike,
  onToggleSave,
  onDelete,
  onTagClick,
}: PostCardProps) {
  const { parsed } = post
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const like = useExplosion<HTMLSpanElement>()
  const save = useExplosion<HTMLSpanElement>()
  const likeIcon = useRef<HTMLSpanElement>(null)
  const saveIcon = useRef<HTMLSpanElement>(null)
  const cardRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const kind = POST_KINDS.find((option) => option.id === parsed.kind)
  // Un hashtag qui est le nom d'un agent du catalogue devient un lien « re: agent ».
  const agents = parsed.tags.flatMap((tag) => agentsByTag.get(tag) ?? [])
  // Les hashtags déjà cliquables dans le texte ne sont pas répétés en chips.
  const inlineTags = new Set(
    tokenize(parsed.body).flatMap((token) =>
      token.type === "tag" ? [token.value] : []
    )
  )
  const chipTags = parsed.tags.filter(
    (tag) => !kindFromTag(tag) && !agentsByTag.has(tag) && !inlineTags.has(tag)
  )
  const isLong = parsed.body.length > CLAMP_LENGTH
  const authorHref = post.author.id.startsWith("demo-")
    ? undefined
    : creatorHref(post.author.id)

  useEffect(() => {
    if (highlighted)
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [highlighted])

  useEffect(() => {
    if (!menuOpen) return
    function close(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
        setConfirmDelete(false)
      }
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [menuOpen])

  function handleLike() {
    replay(likeIcon.current, "fx-icon-like")
    like.explode(post.likedByMe ? { mode: "implode" } : { colors: LIKE_COLORS })
    onLike(post)
  }

  function handleSave() {
    replay(saveIcon.current, "fx-icon-save")
    save.explode(
      saved ? { mode: "implode" } : { colors: SAVE_COLORS, count: 12 }
    )
    onToggleSave(post.id)
  }

  async function handleShare() {
    const url = `${window.location.origin}/community?post=${encodeURIComponent(post.id)}`
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: parsed.title ?? "Odin community", url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  async function handleDelete() {
    setDeleting(true)
    const ok = await onDelete(post.id)
    if (!ok) setDeleting(false)
  }

  const author = (
    <span className="flex min-w-0 flex-col">
      <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <span className="truncate">{post.author.label}</span>
        {!post.author.known && <DevMark kind="missing" note={AUTHOR_NOTE} />}
      </span>
      <span className="truncate font-mono text-xs text-muted-foreground">
        {post.author.handle && <>@{post.author.handle} · </>}
        <time
          dateTime={post.createdAt}
          title={new Date(post.createdAt).toLocaleString("en-US")}
        >
          {formatTimeAgo(post.createdAt)}
        </time>
      </span>
    </span>
  )

  return (
    <article
      ref={cardRef}
      id={`post-${post.id}`}
      className={cn(
        "group/post scroll-mt-32 transition-opacity duration-300",
        deleting && "pointer-events-none scale-[0.98] opacity-40"
      )}
    >
      <SpotlightPanel
        className={cn(
          "flex flex-col gap-4 overflow-hidden rounded-2xl border bg-background-100 p-5 transition-[border-color,box-shadow,transform] duration-300 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 sm:p-6",
          highlighted
            ? "border-primary/50 shadow-lg ring-4 shadow-primary/10 ring-primary/10"
            : "border-muted/30"
        )}
      >
        {post.reason !== "mine" && (
          <p className="-mb-1 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            {post.reason === "following" ? (
              <>
                <UserCheck className="size-3.5 text-blue-500" /> You follow{" "}
                {post.author.label}
              </>
            ) : (
              <>
                <Sparkles className="size-3.5 text-primary" /> Suggested for you
                · popular creator
              </>
            )}
          </p>
        )}

        <header className="flex items-start gap-3">
          {authorHref ? (
            <Link
              href={authorHref}
              className="flex min-w-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <UserAvatar seed={post.author.id} label={post.author.label} />
              {author}
            </Link>
          ) : (
            <span className="flex min-w-0 items-center gap-3">
              <UserAvatar seed={post.author.id} label={post.author.label} />
              {author}
            </span>
          )}

          <div className="ml-auto flex shrink-0 items-center gap-1">
            {kind && kind.id !== "general" && kind.tag && (
              <button
                type="button"
                onClick={() => onTagClick(kind.tag!)}
                className={cn(
                  "rounded-full px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider uppercase ring-1 transition-transform ring-inset hover:scale-105",
                  KIND_STYLES[kind.id]
                )}
              >
                {kind.label}
              </button>
            )}
            {isMine && (
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  aria-label="Post options"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
                  className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  <MoreHorizontal className="size-4" />
                </button>
                {menuOpen && (
                  <div className="absolute top-9 right-0 z-20 w-44 animate-in rounded-xl border border-muted/30 bg-background-100 p-1 shadow-xl duration-150 fade-in-0 zoom-in-95">
                    <button
                      type="button"
                      onClick={() =>
                        confirmDelete ? handleDelete() : setConfirmDelete(true)
                      }
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                      {confirmDelete ? "Click to confirm" : "Delete post"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="flex flex-col gap-2">
          {parsed.title && (
            <h3 className="text-lg leading-snug font-bold text-balance text-foreground">
              {parsed.title}
            </h3>
          )}
          {parsed.body && (
            <div className="relative">
              <p
                className={cn(
                  "text-[15px] leading-relaxed wrap-break-word whitespace-pre-line text-foreground/75",
                  isLong && !expanded && "line-clamp-4"
                )}
              >
                <RichText text={parsed.body} onTagClick={onTagClick} />
              </p>
              {isLong && (
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  className="mt-1 text-sm font-semibold text-primary hover:underline"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}
        </div>

        {post.mediaUrl && (
          <a
            href={post.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-xl border border-muted/30 bg-muted/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- image externe d'un post, taille inconnue */}
            <img
              src={post.mediaUrl}
              alt=""
              loading="lazy"
              className="max-h-105 w-full object-cover transition-transform duration-500 group-hover/post:scale-[1.015]"
            />
          </a>
        )}

        {(agents.length > 0 || chipTags.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {agents.map((agent) => (
              <Link
                key={agent.id}
                href={`/agents/${agent.id}`}
                className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/5 px-2.5 py-1 font-mono text-[11px] text-primary transition-colors hover:border-primary/50 hover:bg-primary/10"
              >
                <span className="text-primary/60">re:</span> {agent.name}
              </Link>
            ))}
            {chipTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick(tag)}
                className="rounded-full bg-muted/10 px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        <footer className="-mx-2 -mb-1 flex items-center gap-1 border-t border-muted/20 pt-2">
          <ActionButton
            label={post.likedByMe ? "Unlike" : "Like"}
            active={post.likedByMe}
            activeClass="text-rose-500 hover:text-rose-500"
            onClick={handleLike}
            containerRef={like.containerRef}
          >
            <span ref={likeIcon} className="inline-flex">
              <Heart className={cn(post.likedByMe && "fill-current")} />
            </span>
            <span key={post.likeCount} className="fx-count-in tabular-nums">
              {formatCompactCount(post.likeCount)}
            </span>
          </ActionButton>

          <span className="inline-flex items-center">
            <ActionButton label="Comments" disabled>
              <MessageCircle />
              <span>—</span>
            </ActionButton>
            <DevMark kind="missing" note={COMMENTS_NOTE} />
          </span>

          <span className="ml-auto inline-flex items-center gap-1">
            <ActionButton
              label={saved ? "Remove from saved" : "Save"}
              active={saved}
              activeClass="text-primary hover:text-primary"
              onClick={handleSave}
              containerRef={save.containerRef}
            >
              <span ref={saveIcon} className="inline-flex">
                <Bookmark className={cn(saved && "fill-current")} />
              </span>
            </ActionButton>
            <ActionButton
              label="Copy link"
              active={copied}
              activeClass="text-emerald-600"
              onClick={handleShare}
            >
              {copied ? <Check /> : <Link2 />}
              <span className="hidden sm:inline">
                {copied ? "Copied" : "Share"}
              </span>
            </ActionButton>
          </span>
        </footer>
      </SpotlightPanel>
    </article>
  )
}
