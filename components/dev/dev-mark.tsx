import { cn } from "@/lib/utils"

export type DevMarkKind = "mock" | "missing"

export const DEV_MARKS_HIDDEN_CLASS = "dev-marks-hidden"
export const DEV_MARKS_STORAGE_KEY = "odin:dev-marks-hidden"

export const DEV_MARK_KINDS: Record<DevMarkKind, { label: string; dot: string }> = {
  mock: { label: "Mock", dot: "bg-amber-400 ring-amber-400/30" },
  missing: { label: "Missing in API/DB", dot: "bg-rose-500 ring-rose-500/30" },
}

export const devMarksEnabled = process.env.NODE_ENV !== "production"

type DevMarkProps = {
  kind: DevMarkKind
  note: string
  className?: string
}

export function DevMark({ kind, note, className }: DevMarkProps) {
  if (!devMarksEnabled) return null

  const { label, dot } = DEV_MARK_KINDS[kind]

  return (
    <span
      role="img"
      aria-label={`${label}: ${note}`}
      title={`${label} — ${note}`}
      className={cn(
        "inline-block size-2 shrink-0 cursor-help rounded-full align-middle ring-2 in-[.dev-marks-hidden]:hidden",
        dot,
        className
      )}
    />
  )
}
