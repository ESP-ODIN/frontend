import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AuroraBackground } from "@/components/motion/aurora-background"
import { CopyCommand } from "@/components/motion/copy-command"
import { Magnetic } from "@/components/motion/magnetic"
import { Marquee } from "@/components/motion/marquee"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

const providers = [
  "OpenAI",
  "Anthropic",
  "Mistral",
  "Google Gemini",
  "Cohere",
  "Groq",
  "Ollama",
  "Azure OpenAI",
]

export function Hero() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#100d09] px-6 py-20 text-center sm:px-10 sm:py-28">
      <AuroraBackground />

      <div className="relative flex flex-col items-center">
        <ScrollReveal className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-xs text-white/70">
          <span className="size-1.5 rounded-full bg-primary" />
          Odin v0.1.0
        </ScrollReveal>

        <ScrollReveal delay={80} className="mt-6 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Le gestionnaire de paquets pour{" "}
            <span className="fx-gradient-text">agents IA</span>.
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <p className="mx-auto mt-6 max-w-lg text-md text-white/55">
            Découvrez, installez et partagez des agents intelligents à partir d&apos;une seule ligne de
            commande. Sandboxés par défaut, signés par leurs auteurs.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={220} className="mt-8">
          <Magnetic>
            <Button
              className="fx-shine h-12 rounded-full px-6 text-base"
              icon={ArrowRight}
              iconPosition="right"
              render={<Link href="/marketplace" />}
            >
              Parcourir la boutique
            </Button>
          </Magnetic>
        </ScrollReveal>

        <ScrollReveal delay={280} className="mt-6">
          <CopyCommand command="curl -sSL get.odin.dev | sh" />
        </ScrollReveal>

        <ScrollReveal delay={340} className="mt-4 flex items-center gap-1.5 text-xs text-white/40">
          <ShieldCheck className="size-3.5 text-primary" />
          Exécution en sandbox · manifestes signés · 99,98% de tests de sécurité passés
        </ScrollReveal>

        <ScrollReveal delay={400} className="mt-14 w-full">
          <p className="mb-4 font-mono text-[11px] tracking-wider text-white/30 uppercase">
            Compatible avec votre stack
          </p>
          <Marquee
            items={providers}
            itemClassName="border-white/10 bg-white/5 text-white/50"
            duration={26}
          />
        </ScrollReveal>
      </div>
    </div>
  )
}
