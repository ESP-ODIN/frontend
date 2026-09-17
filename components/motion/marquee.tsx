import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

type MarqueeProps = {
  items: string[]
  className?: string
  itemClassName?: string
  duration?: number
  reverse?: boolean
}

/** Pure-CSS infinite scroller, paused on hover. No JS needed. */
export function Marquee({ items, className, itemClassName, duration = 32, reverse = false }: MarqueeProps) {
  const doubled = [...items, ...items]

  return (
    <div
      className={cn("fx-marquee-group relative overflow-hidden", className)}
      style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
    >
      <div
        className={cn("fx-marquee-track flex w-max items-center gap-3", reverse && "[animation-direction:reverse]")}
        style={{ "--fx-marquee-duration": `${duration}s` } as CSSProperties}
      >
        {doubled.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border border-muted/30 bg-background-100 px-4 py-2 font-mono text-xs text-muted-foreground",
              itemClassName
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
