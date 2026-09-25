"use client"

import { useRef, type MouseEvent, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type TiltCardProps = {
  children: ReactNode
  className?: string
}

export function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const node = ref.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height

    node.style.setProperty("--fx-x", `${px * 100}%`)
    node.style.setProperty("--fx-y", `${py * 100}%`)

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const rotateX = (0.5 - py) * 8
    const rotateY = (px - 0.5) * 8
    node.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
  }

  function handleMouseLeave() {
    const node = ref.current
    if (!node) return
    node.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)"
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("fx-spotlight transition-transform duration-300 ease-out will-change-transform", className)}
    >
      {children}
    </div>
  )
}
