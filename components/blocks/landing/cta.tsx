import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CtaProps = {
  className?: string
}

export function Cta({ className }: CtaProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-[#1a1a1a] px-6 py-20 text-center",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_50%_100%,_rgba(232,93,4,0.35),_transparent_70%)]"
      />

      <div className="relative flex flex-col items-center gap-6">
        <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-[#faf9f6] sm:text-5xl">
          Envoyez votre premier agent avant le déjeuner.
        </h2>
        <p className="max-w-2xl text-white/50">
          Gratuit pour les auteurs individuels et les agents open source. Aucune carte de crédit.
          Choisissez votre fournisseur de modèle.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" className="px-6" render={<Link href="/docs/install" />}>
            Obtenir la CLI
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="border border-white/15 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
            render={<Link href="/docs" />}
          >
            Consulter la documentation
          </Button>
        </div>
      </div>
    </div>
  )
}
