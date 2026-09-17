import { cn } from "@/lib/utils"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

type SectionHeaderProps = {
  eyebrow: string
  title?: string
  description?: string
  className?: string
  align?: "center" | "left"
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <ScrollReveal
      className={cn(
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 font-mono text-xs tracking-wider text-primary">
        <span className="fx-live-dot size-1.5 rounded-full bg-primary" />
        {eyebrow}
      </span>
      {title && (
        <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{title}</h2>
      )}
      {description && <p className="max-w-2xl text-muted-foreground">{description}</p>}
    </ScrollReveal>
  )
}
