import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type IconTileProps = {
  icon: LucideIcon
  className?: string
}

export function IconTile({ icon: Icon, className }: IconTileProps) {
  return (
    <div
      className={cn(
        "flex size-12 items-center justify-center rounded-xl bg-primary/10",
        className
      )}
    >
      <Icon className="size-6 text-primary" />
    </div>
  )
}
