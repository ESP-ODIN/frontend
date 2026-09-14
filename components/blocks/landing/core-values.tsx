import { Accessibility, Share2, ShieldCheck, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type CoreValue = {
  label: string
  icon: LucideIcon
}

const coreValues: CoreValue[] = [
  { label: "Partage", icon: Share2 },
  { label: "Sécurité", icon: ShieldCheck },
  { label: "Accessibilité", icon: Accessibility },
]

type CoreValuesProps = {
  className?: string
}

export function CoreValues({ className }: CoreValuesProps) {
  return (
    <ul className={cn("flex flex-wrap items-center justify-center gap-x-6 gap-y-2", className)}>
      {coreValues.map(({ label, icon: Icon }) => (
        <li key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="size-4 text-primary" />
          {label}
        </li>
      ))}
    </ul>
  )
}
