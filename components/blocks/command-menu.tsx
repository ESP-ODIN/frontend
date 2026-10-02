"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { ArrowRight, CornerDownLeft, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { agents } from "@/lib/data/agents"
import { AgentIcon } from "@/components/blocks/agent-icon"
import { ThemeToggle } from "@/components/blocks/theme-toggle"

export const commandMenuHandle = DialogPrimitive.createHandle()

type ResultItem = {
  id: string
  href: string
  group: "Agents" | "Pages"
  keywords: string
  render: () => React.ReactNode
}

const pages = [
  { label: "Home", href: "/", sublabel: "Odin home page" },
  { label: "Marketplace", href: "/marketplace", sublabel: "Browse all agents" },
  { label: "Publish", href: "/publish", sublabel: "Publish a new agent" }
]

const exampleAgentIds = new Set(agents.slice(-3).map((agent) => `agent-${agent.slug}`))

const items: ResultItem[] = [
  ...agents.map(
    (agent): ResultItem => ({
      id: `agent-${agent.slug}`,
      href: `/agents/${agent.slug}`,
      group: "Agents",
      keywords: `${agent.name} ${agent.author} ${agent.description}`,
      render: () => (
        <>
          <AgentIcon
            icon={agent.icon}
            label={agent.label}
            color={agent.color}
            className="size-8 rounded-md text-xs"
          />
          <div className="flex flex-col overflow-hidden text-left">
            <span className="truncate font-mono text-sm font-bold text-foreground">
              {agent.name}
            </span>
            <span className="truncate text-xs text-muted-foreground">by {agent.author}</span>
          </div>
        </>
      ),
    })
  ),
  ...pages.map(
    (page): ResultItem => ({
      id: `page-${page.href}`,
      href: page.href,
      group: "Pages",
      keywords: `${page.label} ${page.sublabel}`,
      render: () => (
        <>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/10">
            <ArrowRight className="size-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col overflow-hidden text-left">
            <span className="truncate text-sm font-medium text-foreground">{page.label}</span>
            <span className="truncate text-xs text-muted-foreground">{page.sublabel}</span>
          </div>
        </>
      ),
    })
  ),
]

export function CommandMenu() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        if (commandMenuHandle.isOpen) {
          commandMenuHandle.close()
        } else {
          commandMenuHandle.open(null)
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items.filter((item) => item.group === "Pages" || exampleAgentIds.has(item.id))
    return items.filter((item) => item.keywords.toLowerCase().includes(q))
  }, [query])

  const groups = React.useMemo(() => {
    const map = new Map<string, ResultItem[]>()
    for (const item of results) {
      map.set(item.group, [...(map.get(item.group) ?? []), item])
    }
    return Array.from(map.entries())
  }, [results])

  function navigate(item: ResultItem) {
    commandMenuHandle.close()
    router.push(item.href)
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === "Enter") {
      event.preventDefault()
      const item = results[activeIndex]
      if (item) navigate(item)
    }
  }

  return (
    <DialogPrimitive.Root
      handle={commandMenuHandle}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setQuery("")
          setActiveIndex(0)
        }
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup
          initialFocus={inputRef}
          className="fixed top-[18%] left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-muted/40 bg-popover text-popover-foreground shadow-2xl outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          <DialogPrimitive.Title className="sr-only">Search</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Search agents and navigate Odin
          </DialogPrimitive.Description>

          <div className="flex items-center gap-3 border-b border-muted/40 px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActiveIndex(0)
              }}
              onKeyDown={onInputKeyDown}
              placeholder="Search agents, pages…"
              className="h-12 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <kbd className="shrink-0 rounded-md border border-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              ESC
            </kbd>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {groups.length === 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">
                No results for “{query}”
              </p>
            )}
            {groups.map(([group, groupItems]) => (
              <div key={group} className="mb-2 last:mb-0">
                <p className="px-2 py-1.5 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                  {group}
                </p>
                {groupItems.map((item) => {
                  const index = results.indexOf(item)
                  const isActive = index === activeIndex
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => navigate(item)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                        isActive ? "bg-muted/10" : "hover:bg-muted/10"
                      )}
                    >
                      {item.render()}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-muted/40 px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
            <ThemeToggle />
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <CornerDownLeft className="size-3" /> select
              </span>
              <span>↑↓ navigate</span>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
