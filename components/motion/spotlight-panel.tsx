"use client"

import { useRef, type MouseEvent, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type SpotlightPanelProps = {
  children: ReactNode
  className?: string
  dark?: boolean
}

export function SpotlightPanel({ children, className, dark = false }: SpotlightPanelProps) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    node.style.setProperty("--fx-x", `${event.clientX - rect.left}px`)
    node.style.setProperty("--fx-y", `${event.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn("fx-spotlight", dark && "fx-spotlight-dark", className)}
    >
      {children}
    </div>
  )
}
