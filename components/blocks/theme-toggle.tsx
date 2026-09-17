"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Monitor, Sun } from "lucide-react"

import { cn } from "@/lib/utils"

const OPTIONS = [
  { value: "light", icon: Sun, label: "Clair" },
  { value: "dark", icon: Moon, label: "Sombre" },
  { value: "system", icon: Monitor, label: "Système" },
] as const

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  return (
    <div
      role="radiogroup"
      aria-label="Thème"
      className={cn("flex items-center gap-0.5 rounded-full border border-muted/40 p-0.5", className)}
    >
      {OPTIONS.map((option) => {
        const Icon = option.icon
        const active = mounted && theme === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex size-6 items-center justify-center rounded-full transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
            )}
          >
            <Icon className="size-3.5" />
          </button>
        )
      })}
    </div>
  )
}
