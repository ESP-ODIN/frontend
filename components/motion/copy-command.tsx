"use client"

import { useRef, useState } from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { useExplosion } from "@/components/motion/explosion-burst"

type CopyCommandProps = {
  command: string
  className?: string
}

const COPY_COLORS = ["#34d399", "#6ee7b7", "#a7f3d0", "#e85d04", "#ffb35c"]

export function CopyCommand({ command, className }: CopyCommandProps) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { containerRef, explode } = useExplosion<HTMLSpanElement>()

  async function handleCopy() {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    explode({ colors: COPY_COLORS })
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "fx-float group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-2 pr-2 pl-5 font-mono text-sm text-white/70 transition-colors hover:border-white/20",
        className
      )}
    >
      <span>
        <span className="text-primary">$</span> {command}
      </span>
      <span
        ref={containerRef}
        className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors group-hover:bg-white/20 group-hover:text-white"
      >
        {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
      </span>
    </button>
  )
}
