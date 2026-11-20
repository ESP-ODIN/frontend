"use client"

import Link from "next/link"
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { Bot, Hash, ImageIcon, Loader2, Send, X } from "lucide-react"

import type { Agent } from "@/lib/agents/types"
import { cn } from "@/lib/utils"
import {
  composePost,
  isMediaUrlValid,
  MAX_POST_LENGTH,
  MAX_TITLE_LENGTH,
  POST_KINDS,
  toTag,
} from "@/lib/social/content"
import type { PostKind } from "@/lib/social/types"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/community/user-avatar"

export type ComposerHandle = { focus: () => void }

type ComposerProps = {
  me: { id: string; label: string } | null
  agents: Agent[]
  suggestedTags: string[]
  onSubmit: (input: {
    content: string
    mediaUrl?: string
  }) => Promise<string | null>
}

const MAX_TAGS = 6
const MAX_AGENTS = 3

function CharRing({ used, max }: { used: number; max: number }) {
  const ratio = Math.min(used / max, 1)
  const radius = 9
  const circumference = 2 * Math.PI * radius
  const left = max - used
  return (
    <span
      className="relative inline-flex size-6 items-center justify-center"
      title={`${left} characters left`}
    >
      <svg viewBox="0 0 24 24" className="size-6 -rotate-90">
        <circle
          cx="12"
          cy="12"
          r={radius}
          className="fill-none stroke-muted/25"
          strokeWidth="2.5"
        />
        <circle
          cx="12"
          cy="12"
          r={radius}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          className={cn(
            "fill-none transition-[stroke-dashoffset,stroke] duration-300",
            left < 0
              ? "stroke-destructive"
              : left < 100
                ? "stroke-amber-500"
                : "stroke-primary"
          )}
        />
      </svg>
      {left < 100 && (
        <span
          className={cn(
            "absolute font-mono text-[8px] font-bold",
            left < 0 ? "text-destructive" : "text-amber-600"
          )}
        >
          {left}
        </span>
      )}
    </span>
  )
}

/** Rédaction d'un post. Titre, genre, tags et agents sont encodés dans `content` (lib/social/content). */
export const Composer = forwardRef<ComposerHandle, ComposerProps>(
  function Composer({ me, agents, suggestedTags, onSubmit }, ref) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [kind, setKind] = useState<PostKind>("general")
    const [tags, setTags] = useState<string[]>([])
    const [tagDraft, setTagDraft] = useState("")
    const [linkedAgents, setLinkedAgents] = useState<string[]>([])
    const [agentQuery, setAgentQuery] = useState("")
    const [panel, setPanel] = useState<"tags" | "agents" | "image" | null>(null)
    const [mediaUrl, setMediaUrl] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [justPosted, setJustPosted] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)
    const bodyRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => ({
      focus: () => {
        setOpen(true)
        requestAnimationFrame(() => bodyRef.current?.focus())
      },
    }))

    // Le textarea grandit avec le texte.
    useEffect(() => {
      const node = bodyRef.current
      if (!node) return
      node.style.height = "auto"
      node.style.height = `${Math.min(node.scrollHeight, 420)}px`
    }, [body, open])

    const content = useMemo(
      () => composePost({ title, body, kind, tags, agents: linkedAgents }),
      [title, body, kind, tags, linkedAgents]
    )
    const mediaValid = isMediaUrlValid(mediaUrl.trim())
    const canPost =
      body.trim().length > 0 &&
      content.length <= MAX_POST_LENGTH &&
      mediaValid &&
      !submitting
    const isDirty = Boolean(
      title ||
      body ||
      tags.length ||
      linkedAgents.length ||
      mediaUrl ||
      kind !== "general"
    )

    const agentMatches = useMemo(() => {
      const query = agentQuery.trim().toLowerCase()
      return agents
        .filter((agent) => !linkedAgents.includes(agent.name))
        .filter((agent) => !query || agent.name.toLowerCase().includes(query))
        .slice(0, 6)
    }, [agentQuery, agents, linkedAgents])

    const tagSuggestions = suggestedTags
      .filter((tag) => !tags.includes(tag))
      .slice(0, 8)

    function addTag(raw: string) {
      const tag = toTag(raw.replace(/^#/, ""))
      if (!tag || tags.includes(tag) || tags.length >= MAX_TAGS) return
      setTags((current) => [...current, tag])
      setTagDraft("")
    }

    function reset() {
      setTitle("")
      setBody("")
      setKind("general")
      setTags([])
      setLinkedAgents([])
      setMediaUrl("")
      setPanel(null)
      setError(null)
      setOpen(false)
    }

    async function submit() {
      if (!canPost) return
      setSubmitting(true)
      setError(null)
      const failure = await onSubmit({
        content,
        mediaUrl: mediaUrl.trim() || undefined,
      })
      setSubmitting(false)
      if (failure) {
        setError(failure)
        return
      }
      reset()
      bodyRef.current?.blur()
      setJustPosted(true)
      setTimeout(() => setJustPosted(false), 2200)
    }

    if (!me) {
      return (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-5 sm:flex-row sm:items-center">
          <p className="flex-1 text-sm text-foreground/70">
            <span className="font-semibold text-foreground">
              Join the conversation.
            </span>{" "}
            Sign in to share field reports, ask questions and follow creators.
          </p>
          <Button
            render={<Link href="/login?next=/community" />}
            className="rounded-lg"
          >
            Sign in
          </Button>
        </div>
      )
    }

    return (
      <div
        ref={rootRef}
        className={cn(
          "relative rounded-2xl border bg-background-100 transition-[border-color,box-shadow] duration-300",
          open
            ? "border-primary/40 shadow-xl ring-4 shadow-primary/5 ring-primary/5"
            : "border-muted/30 hover:border-muted/60"
        )}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault()
            void submit()
          }
          if (event.key === "Escape" && !isDirty) setOpen(false)
        }}
      >
        {justPosted && (
          <span className="pointer-events-none absolute -top-3 left-1/2 z-10 -translate-x-1/2 animate-in rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg duration-300 fade-in-0 slide-in-from-bottom-2">
            Posted ✓
          </span>
        )}

        <div className="flex items-start gap-3 p-4">
          <UserAvatar seed={me.id} label={me.label} />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {open && (
              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value.slice(0, MAX_TITLE_LENGTH))
                }
                placeholder="Title (optional)"
                aria-label="Title"
                className="animate-in bg-transparent text-lg font-bold text-foreground duration-200 fade-in-0 outline-none slide-in-from-top-1 placeholder:text-muted-foreground/60"
              />
            )}
            <textarea
              ref={bodyRef}
              value={body}
              rows={open ? 3 : 1}
              onFocus={() => setOpen(true)}
              onChange={(event) => setBody(event.target.value)}
              placeholder={
                open
                  ? "What did you learn running agents today?"
                  : "Share what you learned…"
              }
              aria-label="Post content"
              className={cn(
                "w-full resize-none bg-transparent leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70",
                open
                  ? "min-h-20 text-[15px]"
                  : "h-10 rounded-xl bg-muted/10 px-4 py-2 text-sm"
              )}
            />
          </div>
        </div>

        {open && (
          <div className="flex animate-in flex-col gap-3 px-4 pb-4 duration-300 fade-in-0 slide-in-from-top-2">
            <div className="flex flex-wrap gap-1.5 pl-[52px]">
              {POST_KINDS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={kind === option.id}
                  onClick={() => setKind(option.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-all active:scale-95",
                    kind === option.id
                      ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "border-muted/40 text-foreground/70 hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {(tags.length > 0 || linkedAgents.length > 0) && (
              <div className="flex flex-wrap gap-1.5 pl-[52px]">
                {linkedAgents.map((name) => (
                  <span
                    key={name}
                    className="inline-flex animate-in items-center gap-1 rounded-full border border-primary/25 bg-primary/5 py-0.5 pr-1 pl-2.5 font-mono text-[11px] text-primary zoom-in-90"
                  >
                    re: {name}
                    <button
                      type="button"
                      aria-label={`Remove ${name}`}
                      onClick={() =>
                        setLinkedAgents((current) =>
                          current.filter((item) => item !== name)
                        )
                      }
                      className="rounded-full p-0.5 hover:bg-primary/15"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex animate-in items-center gap-1 rounded-full bg-muted/15 py-0.5 pr-1 pl-2.5 font-mono text-[11px] text-foreground/70 zoom-in-90"
                  >
                    #{tag}
                    <button
                      type="button"
                      aria-label={`Remove #${tag}`}
                      onClick={() =>
                        setTags((current) =>
                          current.filter((item) => item !== tag)
                        )
                      }
                      className="rounded-full p-0.5 hover:bg-muted/25"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {panel === "tags" && (
              <div className="ml-[52px] flex animate-in flex-col gap-2 rounded-xl border border-muted/30 bg-muted/5 p-3 duration-200 fade-in-0 zoom-in-95">
                <input
                  autoFocus
                  value={tagDraft}
                  onChange={(event) => setTagDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === "," ||
                      event.key === " "
                    ) {
                      event.preventDefault()
                      addTag(tagDraft)
                    }
                  }}
                  placeholder={
                    tags.length >= MAX_TAGS
                      ? `Maximum ${MAX_TAGS} tags`
                      : "Add a tag and press Enter"
                  }
                  disabled={tags.length >= MAX_TAGS}
                  className="bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground/60"
                />
                {tagSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tagSuggestions.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="rounded-full px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {panel === "agents" && (
              <div className="ml-[52px] flex animate-in flex-col gap-1 rounded-xl border border-muted/30 bg-muted/5 p-2 duration-200 fade-in-0 zoom-in-95">
                <input
                  autoFocus
                  value={agentQuery}
                  onChange={(event) => setAgentQuery(event.target.value)}
                  placeholder="Search an agent from the marketplace"
                  className="bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground/60"
                />
                {agentMatches.length === 0 ? (
                  <p className="px-1 py-1 text-xs text-muted-foreground">
                    No agent found.
                  </p>
                ) : (
                  agentMatches.map((agent) => (
                    <button
                      key={agent.id}
                      type="button"
                      disabled={linkedAgents.length >= MAX_AGENTS}
                      onClick={() => {
                        setLinkedAgents((current) => [...current, agent.name])
                        setAgentQuery("")
                      }}
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-primary/10 disabled:opacity-50"
                    >
                      <span className="font-mono">{agent.name}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        #{toTag(agent.name)}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}

            {panel === "image" && (
              <div className="ml-[52px] flex animate-in flex-col gap-1 duration-200 fade-in-0 zoom-in-95">
                <input
                  autoFocus
                  value={mediaUrl}
                  onChange={(event) => setMediaUrl(event.target.value)}
                  placeholder="https://… image link"
                  aria-invalid={!mediaValid}
                  className={cn(
                    "rounded-xl border bg-muted/5 px-3 py-2 font-mono text-sm outline-none",
                    mediaValid
                      ? "border-muted/30 focus:border-primary/40"
                      : "border-destructive/50"
                  )}
                />
                {!mediaValid && (
                  <p className="text-xs text-destructive">
                    Use an https:// link (255 characters max).
                  </p>
                )}
              </div>
            )}

            {error && (
              <p className="ml-[52px] animate-in rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive fade-in-0">
                {error}
              </p>
            )}

            <div className="flex items-center gap-1 border-t border-muted/20 pt-3 pl-[44px]">
              {(
                [
                  { id: "tags", icon: Hash, label: "Add tags" },
                  { id: "agents", icon: Bot, label: "Link an agent" },
                  { id: "image", icon: ImageIcon, label: "Add an image" },
                ] as const
              ).map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  aria-label={label}
                  title={label}
                  aria-pressed={panel === id}
                  onClick={() =>
                    setPanel((current) => (current === id ? null : id))
                  }
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-full transition-colors",
                    panel === id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  )}
                >
                  <Icon className="size-[18px]" />
                </button>
              ))}

              <span className="ml-auto flex items-center gap-3">
                <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
                  ⌘ + Enter
                </span>
                <CharRing used={content.length} max={MAX_POST_LENGTH} />
                <button
                  type="button"
                  onClick={reset}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
                <Button
                  type="button"
                  onClick={submit}
                  disabled={!canPost}
                  className="rounded-full px-4 shadow-md shadow-primary/20"
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  Post
                </Button>
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }
)
