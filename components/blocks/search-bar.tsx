"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { commandMenuHandle } from "@/components/blocks/command-menu"

interface SearchBarProps {
  count: number
  className?: string
}

export function SearchBar({ count, className }: SearchBarProps) {
  return (
    <DialogPrimitive.Trigger
      handle={commandMenuHandle}
      className={cn(
        "relative flex h-9 w-1/2 items-center rounded-lg border border-input bg-background/30 px-3 text-left text-base transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <Search className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
      <span className="truncate pr-3 pl-7 text-sm text-muted-foreground sm:pr-16">
        Search {count} agents...
      </span>
      <span className="absolute right-1.5 hidden rounded-full border border-muted/50 bg-background px-2 py-1 text-xs text-muted-foreground sm:inline-block">
        ⌘K
      </span>
    </DialogPrimitive.Trigger>
  )
}
