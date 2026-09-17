import { Code, GitBranch, Package, Shield, Users, Zap, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { IconTile } from "@/components/blocks/icon-tile"
import { SectionHeader } from "@/components/blocks/landing/section-header"

type FeatureItem = {
  title: string
  description: string
  icon: LucideIcon
}

const features: FeatureItem[] = [
  {
    title: "Une commande d'installation",
    description:
      "Chaque agent sur Odin s'installe et s'exécute via la même CLI. Pas de configuration sur mesure, pas de scripts copiés-collés.",
    icon: Package,
  },
  {
    title: "En mode « sandbox » par défaut",
    description:
      "Les agents s'exécutent dans des environnements isolés. L'accès réseau, fichiers et outils est déclaré dans le manifest et validé à l'installation.",
    icon: Shield,
  },
  {
    title: "Semver, mais pour les agents",
    description:
      "Épinglez une version. Revenez en arrière instantanément. Lisez des changelogs qui expliquent comment le comportement de l'agent a évolué entre les versions.",
    icon: GitBranch,
  },
  {
    title: "Conçu autour d'une communauté",
    description:
      "Lisez des REX de gens qui font tourner l'agent en production. Suivez des auteurs, regardez des tutoriels. Le marketplace est aussi un réseau social.",
    icon: Users,
  },
  {
    title: "Flux de travail ou autonomes",
    description:
      "Publiez un workflow déterministe aux étapes prévisibles, ou un agent entièrement autonome qui construit son propre plan. Les deux partagent le même contrat de packaging.",
    icon: Zap,
  },
  {
    title: "SDK pour n'importe quel environnement",
    description:
      "Créez des agents en TypeScript, Python ou Rust. Apportez votre propre fournisseur de LLM. Odin gère la distribution, la signature et les mises à jour.",
    icon: Code,
  },
]

type HowItWorksProps = {
  className?: string
}

export function HowItWorks({ className }: HowItWorksProps) {
  return (
    <div className={cn("flex flex-col items-center gap-10", className)}>
      <SectionHeader
        eyebrow="COMMENT ÇA FONCTIONNE"
        title="Considérez les agents comme des colis."
        description="Manifestes standards. Versions sémantiques. Éditeurs signés. Exécution en sandbox. Tout ce qu'on attend d'un écosystème de paquets moderne — appliqué aux agents autonomes."
      />

      <div className="grid w-full grid-cols-1 rounded-3xl border border-muted/40 lg:grid-cols-3">
        {features.map(({ title, description, icon: Icon }, index) => (
          <div
            key={title}
            className={cn(
              "flex flex-col gap-5 p-6 sm:p-8",
              index !== 0 && "border-t border-muted/40 lg:border-t-0",
              index % 3 !== 0 && "lg:border-l lg:border-muted/40",
              index >= 3 && "lg:border-t lg:border-muted/40"
            )}
          >
            <IconTile icon={Icon} />
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-foreground">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
