"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Hash, Search, X } from "lucide-react"

import type { Agent } from "@/lib/agents/types"
import { AgentIcon } from "@/components/agent/agent-icon"
import { collectTags, normalize, searchAgents, suggestTags, tokenize } from "@/lib/agents/search"
import { cn } from "@/lib/utils"

type SearchBarProps = {
  agents: Agent[]
  query: string
  tags: string[]
  onQueryChange: (query: string) => void
  onTagsChange: (tags: string[]) => void
}

type Option = { kind: "tag"; tag: string; count: number } | { kind: "agent"; agent: Agent }

const MAX_AGENT_SUGGESTIONS = 4

function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  const normalized = normalize(text)
  if (normalized.length !== text.length) return <>{text}</>

  for (const token of tokens) {
    const start = normalized.indexOf(token)
    if (start === -1) continue
    return (
      <>
        {text.slice(0, start)}
        <mark className="bg-transparent font-bold text-primary">{text.slice(start, start + token.length)}</mark>
        {text.slice(start + token.length)}
      </>
    )
  }
  return <>{text}</>
}

export function SearchBar({ agents, query, tags, onQueryChange, onTagsChange }: SearchBarProps) {
  const router = useRouter()
  const listboxId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const allTags = useMemo(() => collectTags(agents), [agents])
  const tokens = tokenize(query)
  const lastToken = tokens.at(-1) ?? ""

  const options = useMemo<Option[]>(() => {
    const tagOptions = suggestTags(allTags, lastToken, tags).map(
      (entry): Option => ({ kind: "tag", tag: entry.tag, count: entry.count })
    )
    const agentOptions = query.trim()
      ? searchAgents(agents, query, tags)
          .slice(0, MAX_AGENT_SUGGESTIONS)
          .map((agent): Option => ({ kind: "agent", agent }))
      : []
    return [...tagOptions, ...agentOptions]
  }, [agents, allTags, lastToken, query, tags])

  const tagOptions = options.filter((option) => option.kind === "tag")
  const agentOptions = options.filter((option) => option.kind === "agent")

  useEffect(() => {
    setActiveIndex(-1)
  }, [query, tags])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest("input, textarea, [contenteditable='true']")) return
      event.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [])

  function addTag(tag: string) {
    onTagsChange([...tags, tag])
    const remaining = query.trim().split(/\s+/).slice(0, -1).join(" ")
    onQueryChange(lastToken ? remaining : query)
    inputRef.current?.focus()
  }

  function removeTag(tag: string) {
    onTagsChange(tags.filter((item) => item !== tag))
    inputRef.current?.focus()
  }

  function select(option: Option) {
    if (option.kind === "tag") {
      addTag(option.tag)
    } else {
      setOpen(false)
      router.push(`/agents/${option.agent.id}`)
    }
  }

  function clear() {
    onQueryChange("")
    onTagsChange([])
    inputRef.current?.focus()
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((index) => (options.length === 0 ? -1 : (index + 1) % options.length))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => (options.length === 0 ? -1 : (index - 1 + options.length) % options.length))
    } else if (event.key === "Enter") {
      if (open && activeIndex >= 0 && options[activeIndex]) {
        event.preventDefault()
        select(options[activeIndex])
      } else {
        setOpen(false)
      }
    } else if (event.key === "Escape") {
      if (open) setOpen(false)
      else inputRef.current?.blur()
    } else if (event.key === "Backspace" && query === "" && tags.length > 0) {
      onTagsChange(tags.slice(0, -1))
    }
  }

  const showPanel = open && options.length > 0
  const hasContent = query !== "" || tags.length > 0

  function renderOption(option: Option) {
    const index = options.indexOf(option)
    const active = index === activeIndex
    const id = `${listboxId}-${index}`

    return (
      <li
        key={option.kind === "tag" ? `tag-${option.tag}` : option.agent.id}
        id={id}
        role="option"
        aria-selected={active}
        onPointerDown={(event) => event.preventDefault()}
        onClick={() => select(option)}
        onPointerMove={() => setActiveIndex(index)}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
          active ? "bg-primary/10 text-foreground" : "text-foreground/80"
        )}
      >
        {option.kind === "tag" ? (
          <>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/15 text-muted-foreground">
              <Hash className="size-3.5" />
            </span>
            <span className="flex-1 font-mono">
              <Highlight text={option.tag} tokens={lastToken ? [lastToken] : []} />
            </span>
            <span className="rounded-full bg-muted/15 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
              {option.count}
            </span>
          </>
        ) : (
          <>
            <AgentIcon icon={option.agent.icon} name={option.agent.name} className="size-7 shrink-0 text-[10px]" />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-mono font-bold">
                <Highlight text={option.agent.name} tokens={tokens} />
              </span>
              {option.agent.description && (
                <span className="truncate text-xs text-muted-foreground">{option.agent.description}</span>
              )}
            </span>
            <ArrowRight
              className={cn("size-3.5 shrink-0 text-primary transition-all", active ? "opacity-100" : "-translate-x-1 opacity-0")}
            />
          </>
        )}
      </li>
    )
  }

  return (
    <div ref={rootRef} className="relative">
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "flex min-h-12 cursor-text flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-background-100 px-3.5 py-2 transition-[border-color,box-shadow] duration-200",
          "hover:border-primary/30 focus-within:border-primary/50 focus-within:shadow-lg focus-within:ring-[3px] focus-within:shadow-primary/5 focus-within:ring-primary/15"
        )}
      >
        <Search className="size-4 shrink-0 text-muted-foreground" />

        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex animate-in items-center gap-1 rounded-full bg-primary/10 py-0.5 pr-1 pl-2.5 font-mono text-xs font-bold text-primary duration-200 zoom-in-90 fade-in-0"
          >
            #{tag}
            <button
              type="button"
              aria-label={`Remove tag ${tag}`}
              onClick={(event) => {
                event.stopPropagation()
                removeTag(tag)
              }}
              className="flex size-4 items-center justify-center rounded-full transition-colors hover:bg-primary/20"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
          aria-label="Search agents"
          value={query}
          onChange={(event) => {
            onQueryChange(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={tags.length > 0 ? "Refine…" : "Search agents by name, tag, runtime…"}
          className="h-8 min-w-32 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />

        {hasContent ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={(event) => {
              event.stopPropagation()
              clear()
            }}
            className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/20 hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        ) : (
          <kbd className="hidden shrink-0 rounded-md border border-border/60 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground sm:inline">
            /
          </kbd>
        )}
      </div>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 animate-in rounded-xl border border-border/60 bg-background-100 p-1.5 shadow-xl shadow-black/10 duration-150 fade-in-0 slide-in-from-top-1">
          <ul id={listboxId} role="listbox" aria-label="Suggestions" className="flex flex-col">
            {tagOptions.length > 0 && (
              <li role="presentation" className="px-2.5 pt-1.5 pb-1 font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                {lastToken ? "Tags" : "Popular tags"}
              </li>
            )}
            {tagOptions.map(renderOption)}
            {agentOptions.length > 0 && (
              <li role="presentation" className="px-2.5 pt-2.5 pb-1 font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Agents
              </li>
            )}
            {agentOptions.map(renderOption)}
          </ul>
        </div>
      )}
    </div>
  )
}
