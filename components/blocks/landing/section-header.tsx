import { cn } from "@/lib/utils"

type SectionHeaderProps = {
  eyebrow: string
  title?: string
  description?: string
  className?: string
}

export function SectionHeader({ eyebrow, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-6 text-center", className)}>
      <p className="text-sm font-mono tracking-wider text-primary">{eyebrow}</p>
      {title && (
        <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h2>
      )}
      {description && <p className="max-w-2xl text-muted-foreground">{description}</p>}
    </div>
  )
}
