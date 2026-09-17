import Link from "next/link"
import { Shield, Users, Zap, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { IconTile } from "@/components/blocks/icon-tile"
import { SectionHeader } from "@/components/blocks/landing/section-header"

type ValueItem = {
  label: string
  description: string
  icon: LucideIcon
  href: string
  cta: string
}

const values: ValueItem[] = [
  {
    label: "Partage",
    description:
      "Je donne la visibilité à mes agents et j'échange avec la communauté — chaque publication enrichit l'écosystème commun.",
    icon: Users,
    href: "/publish",
    cta: "Publier un agent",
  },
  {
    label: "Sécurité",
    description:
      "Chaque agent est vérifié, ses actions sont contrôlées et tracées. Vous savez exactement ce que fait votre agent — et ce qu'il ne peut pas faire.",
    icon: Shield,
    href: "/permissions",
    cta: "Voir les permissions",
  },
  {
    label: "Accessibilité",
    description:
      "L'utilisation d'agents à la portée de tous — une commande suffit. Pas de configuration complexe, pas de prérequis techniques.",
    icon: Zap,
    href: "/get-started",
    cta: "Commencer maintenant",
  },
]

type ValuesProps = {
  className?: string
}

export function Values({ className }: ValuesProps) {
  return (
    <div className={cn("flex flex-col items-center gap-10", className)}>
      <SectionHeader eyebrow="NOS VALEURS" />

      <div className="grid w-full grid-cols-1 rounded-3xl border border-muted/40 sm:grid-cols-3">
        {values.map(({ label, description, icon, href, cta }, index) => (
          <div
            key={label}
            className={cn(
              "flex flex-col gap-5 p-6 sm:p-8",
              index !== 0 && "border-t border-muted/40 sm:border-t-0 sm:border-l"
            )}
          >
            <IconTile icon={icon} />
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-foreground">{label}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <Link
              href={href}
              className="mt-auto pt-4 font-mono text-sm text-primary before:content-['→_'] hover:underline"
            >
              {cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
