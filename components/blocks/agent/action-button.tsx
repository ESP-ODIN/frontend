"use client"

import { useCallback, useRef } from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type ActionButtonProps = {
  icon: LucideIcon
  pressed: boolean
  label?: string
  count?: string
  onClick: () => void
  // Animation class replayed on the icon at each click (see .fx-icon-* in globals.css)
  iconAnimation: string
  // Hover nudge on the icon, so each action has its own personality
  iconHover?: string
  pressedClassName?: string
  // Fill the icon when pressed (thumbs, bookmark); off for outline-only icons
  fillOnPress?: boolean
  className?: string
  "aria-label"?: string
}

// Restarts a CSS animation on an element, even when the same class is already applied
function replay(node: HTMLElement | null, className: string) {
  if (!node) return
  node.classList.remove(className)
  void node.offsetWidth
  node.classList.add(className)
}

export function ActionButton({
  icon: Icon,
  pressed,
  label,
  count,
  onClick,
  iconAnimation,
  iconHover,
  pressedClassName,
  fillOnPress = true,
  className,
  "aria-label": ariaLabel,
}: ActionButtonProps) {
  const iconRef = useRef<HTMLSpanElement>(null)

  const handleClick = useCallback(() => {
    replay(iconRef.current, iconAnimation)
    onClick()
  }, [iconAnimation, onClick])

  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={ariaLabel}
      onClick={handleClick}
      className={cn(
        "group/action relative inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-sm font-medium text-foreground/70 outline-none select-none",
        "transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-out",
        "hover:bg-foreground/5 hover:text-foreground",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "active:scale-95",
        pressed && pressedClassName,
        className
      )}
    >
      <span
        ref={iconRef}
        className={cn(
          "inline-flex transition-transform duration-200 ease-out [&_svg]:size-4 [&_svg]:transition-[fill] [&_svg]:duration-200",
          iconHover,
          pressed && fillOnPress && "[&_svg]:fill-current"
        )}
      >
        <Icon />
      </span>
      {label && <span>{label}</span>}
      {count !== undefined && (
        <span
          key={count}
          className="fx-count-in font-mono text-xs tabular-nums opacity-80 group-hover/action:opacity-100"
        >
          {count}
        </span>
      )}
    </button>
  )
}
