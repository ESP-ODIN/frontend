import { cn } from "@/lib/utils"

type AuroraBackgroundProps = {
  className?: string
}

export function AuroraBackground({ className }: AuroraBackgroundProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="fx-aurora-a absolute -top-[20%] -left-[15%] size-[60%] rounded-full bg-primary/40 blur-[110px]" />
      <div className="fx-aurora-b absolute top-[8%] -right-[10%] size-[55%] rounded-full bg-amber-400/25 blur-[120px]" />
      <div className="fx-aurora-c absolute -bottom-[25%] left-[20%] size-[50%] rounded-full bg-orange-600/20 blur-[100px]" />
      <div className="fx-grid-overlay absolute inset-0 opacity-50" />
    </div>
  )
}
