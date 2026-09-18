"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type LineKind = "comment" | "command" | "output" | "result"

type TerminalLine = {
  kind: LineKind
  text: string
  /** Délai avant l'apparition de la ligne, en ms */
  delay?: number
}

type TerminalProps = {
  className?: string
  /** Chemin affiché dans la barre de titre */
  title?: string
  /** Rejoue l'animation en boucle une fois la séquence terminée */
  loop?: boolean
}

const lines: TerminalLine[] = [
  { kind: "comment", text: "# Install your first agent — under 2 seconds" },
  { kind: "command", text: "odin install code-reviewer", delay: 500 },
  { kind: "output", text: "resolving manifest…", delay: 450 },
  { kind: "output", text: "verifying signature ✓", delay: 550 },
  { kind: "result", text: "code-reviewer@2.4.1 installed in 1.2s", delay: 700 },
  { kind: "comment", text: "# Run it on the current repo", delay: 800 },
  { kind: "command", text: "odin run code-reviewer .", delay: 400 },
  { kind: "output", text: "analyzing 128 files…", delay: 500 },
  { kind: "result", text: "3 suggestions · 0 blocking error ✓", delay: 900 },
]

/** Vitesse de frappe par caractère (ms). Les sorties s'affichent d'un bloc. */
const TYPING_SPEED = 42

const prefix: Record<LineKind, string> = {
  comment: "",
  command: "$ ",
  output: "→ ",
  result: "→ ",
}

const lineStyles: Record<LineKind, string> = {
  comment: "text-white/25",
  command: "text-white/90",
  output: "text-white/35",
  result: "text-emerald-400/85",
}

export function Terminal({
  className,
  title = "~/projects/odin-demo · odin v0.1.0",
  loop = false,
}: TerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [typed, setTyped] = useState<string[]>([])

  // L'animation ne démarre que lorsque le terminal entre dans le viewport.
  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) {
      setTyped(lines.map((line) => line.text))
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms)
      })

    const run = async () => {
      do {
        setTyped([])
        for (const [index, line] of lines.entries()) {
          await wait(line.delay ?? 400)
          if (cancelled) return

          // Les lignes tapées par l'utilisateur s'écrivent caractère par caractère,
          // les sorties de la CLI apparaissent instantanément.
          if (line.kind === "comment" || line.kind === "command") {
            for (let length = 1; length <= line.text.length; length++) {
              await wait(TYPING_SPEED)
              if (cancelled) return
              setTyped((prev) => {
                const next = prev.slice(0, index)
                next[index] = line.text.slice(0, length)
                return next
              })
            }
          } else {
            setTyped((prev) => {
              const next = prev.slice(0, index)
              next[index] = line.text
              return next
            })
          }
        }

        if (loop) await wait(4000)
      } while (loop && !cancelled)
    }

    void run()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [started, loop])

  const activeIndex = typed.length - 1
  const isDone = typed.length === lines.length && typed[activeIndex] === lines[activeIndex]?.text

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-hidden rounded-3xl bg-[#1a1a1a] shadow-2xl shadow-black/20 ring-1 ring-white/10",
        className,
      )}
    >
      <div className="flex items-center gap-4 border-b border-white/5 bg-[#141414] px-5 py-3.5">
        <div className="flex gap-2" aria-hidden>
          <span className="size-3 rounded-full bg-white/20" />
          <span className="size-3 rounded-full bg-white/20" />
          <span className="size-3 rounded-full bg-white/20" />
        </div>
        <p className="font-mono text-xs text-white/35">{title}</p>
      </div>

      <div className="px-6 py-6 font-mono text-[13px] leading-7">
        {lines.map((line, index) => {
          const content = typed[index] ?? ""
          const isTyping = index === activeIndex && !isDone

          return (
            <p
              key={line.text}
              className={cn("min-h-7 whitespace-pre-wrap break-all", lineStyles[line.kind])}
            >
              {content && (
                <span className={cn(line.kind === "command" && "text-primary")}>
                  {prefix[line.kind]}
                </span>
              )}
              {content}
              {isTyping && <Caret />}
            </p>
          )
        })}
      </div>
    </div>
  )
}

function Caret() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-caret-blink bg-white/80"
    />
  )
}
