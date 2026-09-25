"use client"

import { useCallback, useRef } from "react"

const DEFAULT_COLORS = ["#e85d04", "#ffb35c", "#ffd8a8", "#fff2df", "#ff8a3d"]
const DEFAULT_IMPLODE_COLORS = ["#94a3b8", "#cbd5e1", "#64748b", "#e2e8f0"]

type ExplodeOptions = {
  count?: number
  colors?: string[]
  mode?: "burst" | "implode"
}

export function useExplosion<T extends HTMLElement = HTMLElement>() {
  const containerRef = useRef<T | null>(null)

  const explode = useCallback((options: ExplodeOptions = {}) => {
    const node = containerRef.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const { mode = "burst", count = mode === "burst" ? 18 : 12 } = options
    const colors = options.colors ?? (mode === "burst" ? DEFAULT_COLORS : DEFAULT_IMPLODE_COLORS)
    const rect = node.getBoundingClientRect()
    const radius = Math.max(rect.width, rect.height) * 0.7
    const popClass = mode === "burst" ? "fx-pop" : "fx-pop-out"
    const ringClass = mode === "burst" ? "fx-explosion-ring" : "fx-implosion-ring"
    const particleClass = mode === "burst" ? "fx-explosion-particle" : "fx-implosion-particle"

    node.classList.remove("fx-pop", "fx-pop-out")
    void node.offsetWidth
    node.classList.add(popClass)

    const ring = document.createElement("span")
    ring.className = ringClass
    ring.style.color = colors[0]
    node.appendChild(ring)
    ring.addEventListener("animationend", () => ring.remove())

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span")
      particle.className = particleClass
      const angle = (360 / count) * i + (Math.random() * 24 - 12)
      const distance = radius * (0.8 + Math.random() * 0.9)
      const dim = 4 + Math.random() * 5
      const duration = 500 + Math.random() * 450

      particle.style.setProperty("--fx-angle", `${angle}deg`)
      particle.style.setProperty("--fx-distance", `${distance}px`)
      particle.style.setProperty("--fx-duration", `${duration}ms`)
      particle.style.width = `${dim}px`
      particle.style.height = `${dim}px`
      particle.style.background = colors[i % colors.length]

      node.appendChild(particle)
      particle.addEventListener("animationend", () => particle.remove())
    }
  }, [])

  return { containerRef, explode }
}
