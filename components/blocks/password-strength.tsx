"use client"

import { cn } from "@/lib/utils"

type PasswordStrengthProps = {
  password: string
  className?: string
}

const LEVELS = [
  { label: "Weak", bar: "bg-red-500", text: "text-red-600" },
  { label: "Medium", bar: "bg-orange-500", text: "text-orange-600" },
  { label: "Bon", bar: "bg-yellow-500", text: "text-yellow-700" },
  { label: "Excellent", bar: "bg-emerald-500", text: "text-emerald-600" },
] as const

function scorePassword(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  return score
}

function levelFromScore(score: number) {
  if (score <= 1) return 0
  if (score === 2) return 1
  if (score === 3) return 2
  return 3
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  if (!password) return null

  const level = levelFromScore(scorePassword(password))
  const active = LEVELS[level]

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex gap-1.5">
        {LEVELS.map((item, i) => (
          <span
            key={item.label}
            className={cn(
              "h-1.5 flex-1 rounded-full bg-muted/20 transition-colors duration-300",
              i <= level && active.bar
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs font-medium transition-colors duration-300", active.text)}>
        Password strength: {active.label}
      </p>
    </div>
  )
}
