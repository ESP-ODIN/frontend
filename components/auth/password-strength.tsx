"use client"

import { Check, X } from "lucide-react"

import { PASSWORD_RULES, passwordStrength } from "@/lib/auth/password"
import { cn } from "@/lib/utils"

const STRENGTH_LEVELS = [
  { label: "Too weak", bar: "bg-destructive", text: "text-destructive" },
  { label: "Weak", bar: "bg-orange-500", text: "text-orange-500" },
  { label: "Fair", bar: "bg-amber-400", text: "text-amber-500" },
  { label: "Good", bar: "bg-lime-500", text: "text-lime-600" },
  { label: "Strong", bar: "bg-emerald-500", text: "text-emerald-600" },
] as const

/** Jauge de force et liste des règles, mise à jour à chaque frappe. */
export function PasswordStrength({ value }: { value: string }) {
  const { score } = passwordStrength(value)
  const level = STRENGTH_LEVELS[score]
  const empty = value.length === 0

  return (
    <div className="flex flex-col gap-2.5" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1">
          {STRENGTH_LEVELS.slice(1).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                !empty && i < Math.max(score, 1) ? level.bar : "bg-muted/30"
              )}
            />
          ))}
        </div>
        <span
          className={cn(
            "w-16 text-right text-xs font-medium transition-colors",
            empty ? "text-muted-foreground" : level.text
          )}
        >
          {empty ? "Strength" : level.label}
        </span>
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(value)
          return (
            <li
              key={rule.label}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors duration-300",
                ok
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                  : "border-muted/40 text-muted-foreground"
              )}
            >
              {ok ? <Check className="size-3" /> : <X className="size-3" />}
              {rule.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
