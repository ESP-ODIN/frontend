"use client"

import { useRef, type MouseEvent, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type MagneticProps = {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ children, className, strength = 12 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const node = ref.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const rect = node.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength
    node.style.transform = `translate(${x}px, ${y}px)`
  }

  function handleMouseLeave() {
    const node = ref.current
    if (!node) return
    node.style.transform = "translate(0, 0)"
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("inline-flex transition-transform duration-200 ease-out", className)}
    >
      {children}
    </div>
  )
}
