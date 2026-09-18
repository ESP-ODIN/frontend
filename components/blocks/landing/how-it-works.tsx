import { Code, GitBranch, Package, Shield, Users, Zap, type LucideIcon } from "lucide-react"

import { IconTile } from "@/components/blocks/icon-tile"
import { SectionHeader } from "@/components/blocks/landing/section-header"
import { SpotlightPanel } from "@/components/motion/spotlight-panel"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

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

export function HowItWorks() {
  return (
    <div id="how-it-works" className="flex scroll-mt-28 flex-col items-center gap-10">
      <SectionHeader
        eyebrow="COMMENT ÇA FONCTIONNE"
        title="Considérez les agents comme des colis."
        description="Manifestes standards. Versions sémantiques. Éditeurs signés. Exécution en sandbox. Tout ce qu'on attend d'un écosystème de paquets moderne — appliqué aux agents autonomes."
      />

      <div className="relative grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
        {features.map(({ title, description, icon: Icon }, index) => (
          <ScrollReveal key={title} delay={index * 80}>
            <SpotlightPanel className="group flex h-full flex-col gap-5 rounded-2xl border border-muted/40 bg-background-100 p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 sm:p-8">
              <div className="flex items-center gap-3">
                <IconTile icon={Icon} className="transition-transform group-hover:scale-105" />
                <span className="font-mono text-xs text-muted-foreground/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </SpotlightPanel>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
