import { cn } from "@/lib/utils"

type StatItem = {
  value: string
  label: string
}

type StatsProps = {
  className?: string
}

const stats: StatItem[] = [
  { value: "2,481", label: "AGENTS PUBLIÉS" },
  { value: "14.2M", label: "INSTALLATION / MOIS" },
  { value: "38K", label: "AUTEURS" },
  { value: "99,98%", label: "TEST DE SÉCURITÉ PASSÉ" },
]

export function Stats({ className }: StatsProps) {
  return (
    <div className="grid grid-cols-2 border-t border-b border-muted/40 sm:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.value}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-4 text-center",
            index % 2 !== 0 && "border-l border-muted/40",
            index >= 2 && "border-t border-muted/40",
            "sm:border-t-0",
            index !== 0 && "sm:border-l"
          )}
        >
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-sm text-muted-foreground font-mono tracking-wider">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
