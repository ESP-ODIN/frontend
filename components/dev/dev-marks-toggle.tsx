"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import {
  DEV_MARK_KINDS,
  DEV_MARKS_HIDDEN_CLASS,
  DEV_MARKS_STORAGE_KEY,
  devMarksEnabled,
} from "@/components/dev/dev-mark"

/** Bouton du Cmd+K qui affiche ou masque les pastilles de dev, et retient le choix. */
export function DevMarksToggle() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    setHidden(document.documentElement.classList.contains(DEV_MARKS_HIDDEN_CLASS))
  }, [])

  if (!devMarksEnabled) return null

  function toggle() {
    const next = !hidden
    setHidden(next)
    document.documentElement.classList.toggle(DEV_MARKS_HIDDEN_CLASS, next)
    try {
      localStorage.setItem(DEV_MARKS_STORAGE_KEY, next ? "1" : "0")
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!hidden}
      title="Dev markers: mocked data and data missing from the API"
      className={cn(
        "flex items-center gap-2 rounded-md border border-muted/40 px-2 py-1 transition-colors hover:bg-muted/10",
        hidden && "opacity-50"
      )}
    >
      {Object.values(DEV_MARK_KINDS).map((kind) => (
        <span key={kind.label} className="flex items-center gap-1">
          <span className={cn("size-2 rounded-full ring-2", kind.dot)} />
          {kind.label}
        </span>
      ))}
      <span className="text-foreground">{hidden ? "show" : "hide"}</span>
    </button>
  )
}
