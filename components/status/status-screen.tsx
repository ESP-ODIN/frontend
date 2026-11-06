import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { AuroraBackground } from "@/components/motion/aurora-background"

export type StatusLine = {
  kind: "command" | "output" | "error"
  text: string
}

type StatusScreenProps = {
  code: string
  eyebrow: string
  title: ReactNode
  description: ReactNode
  lines: StatusLine[]
  actions: ReactNode
  tone?: "primary" | "danger"
  className?: string
}

const LINE_STAGGER_MS = 260

const ENTER = "animate-in fade-in-0 slide-in-from-bottom-3 [animation-duration:600ms] [animation-fill-mode:both] motion-reduce:animate-none"

const linePrefix: Record<StatusLine["kind"], string> = {
  command: "$ ",
  output: "→ ",
  error: "✗ ",
}

const lineStyles: Record<StatusLine["kind"], string> = {
  command: "text-white/90",
  output: "text-white/55",
  error: "text-rose-400",
}

/**
 * Base commune des pages 404, erreur et autres états : code géant animé sur l'aurora, mini
 * terminal qui affiche le problème ligne par ligne, puis les actions.
 */
export function StatusScreen({
  code,
  eyebrow,
  title,
  description,
  lines,
  actions,
  tone = "primary",
  className,
}: StatusScreenProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl bg-[#100d09] px-6 py-16 text-center sm:px-10 sm:py-24",
        className
      )}
    >
      <AuroraBackground />

      <div className="relative flex flex-col items-center">
        <div className={cn(ENTER, "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-xs tracking-wider text-white/75 uppercase")}>
          <span className="relative flex size-2">
            <span
              className={cn(
                "fx-pulse-ring absolute inset-0 rounded-full",
                tone === "danger" ? "bg-rose-500" : "bg-primary"
              )}
            />
            <span className={cn("relative size-2 rounded-full", tone === "danger" ? "bg-rose-500" : "bg-primary")} />
          </span>
          {eyebrow}
        </div>

        <div className={cn(ENTER, "relative mt-6 select-none")} style={{ animationDelay: "80ms" }}>
          <span aria-hidden className="fx-gradient-text absolute inset-0 font-mono text-[6.5rem] leading-none font-bold tracking-tighter opacity-50 blur-2xl sm:text-[11rem]">
            {code}
          </span>
          <span aria-hidden className="fx-float relative block">
            <span className="fx-gradient-text block font-mono text-[6.5rem] leading-none font-bold tracking-tighter sm:text-[11rem]">
              {code}
            </span>
            <span className="fx-glitch absolute inset-0 font-mono text-[6.5rem] leading-none font-bold tracking-tighter text-primary opacity-0 sm:text-[11rem]">
              {code}
            </span>
            <span className="fx-glitch-late absolute inset-0 font-mono text-[6.5rem] leading-none font-bold tracking-tighter text-sky-400/80 opacity-0 mix-blend-screen sm:text-[11rem]">
              {code}
            </span>
          </span>
        </div>

        <div className={cn(ENTER, "mt-6 max-w-2xl")} style={{ animationDelay: "160ms" }}>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
        </div>

        <p className={cn(ENTER, "mx-auto mt-4 max-w-md text-white/70")} style={{ animationDelay: "220ms" }}>
          {description}
        </p>

        <div className={cn(ENTER, "mt-10 w-full max-w-md")} style={{ animationDelay: "280ms" }}>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 text-left shadow-2xl shadow-black/40 backdrop-blur-md">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="ml-2 font-mono text-[11px] text-white/50">odin · status</span>
            </div>
            <div className="flex flex-col gap-1.5 p-4 font-mono text-[13px] leading-6">
              {lines.map((line, index) => (
                <p
                  key={`${line.kind}-${line.text}`}
                  className={cn(
                    "animate-in break-all fade-in-0 slide-in-from-left-2 [animation-duration:400ms] [animation-fill-mode:both] motion-reduce:animate-none",
                    lineStyles[line.kind]
                  )}
                  style={{ animationDelay: `${600 + index * LINE_STAGGER_MS}ms` }}
                >
                  <span className={line.kind === "command" ? "text-primary" : undefined}>
                    {linePrefix[line.kind]}
                  </span>
                  {line.text}
                </p>
              ))}
              <span aria-hidden className="fx-live-dot mt-1 inline-block h-4 w-2 bg-primary/80" />
            </div>
          </div>
        </div>

        <div className={cn(ENTER, "mt-10 flex flex-wrap items-center justify-center gap-3")} style={{ animationDelay: "340ms" }}>
          {actions}
        </div>
      </div>
    </section>
  )
}
