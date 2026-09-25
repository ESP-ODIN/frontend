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
  "n8n",
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
            The package manager for{" "}
            <span className="fx-gradient-text">AI agents</span>.
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <p className="mx-auto mt-6 max-w-lg text-md text-white/55">
            Discover, install and share intelligent agents from a single command line. Sandboxed
            by default, signed by their authors.
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
              Browse the store
            </Button>
          </Magnetic>
        </ScrollReveal>

        <ScrollReveal delay={280} className="mt-6">
            <Magnetic>
          <CopyCommand command="curl -sSL get.odin.dev | sh" />
            </Magnetic>
        </ScrollReveal>

        <ScrollReveal delay={340} className="mt-4 flex items-center gap-1.5 text-xs text-white/40">
          <ShieldCheck className="size-3.5 text-primary" />
          Sandboxed execution · signed manifests · 99.98% of security tests passed
        </ScrollReveal>

        <ScrollReveal delay={400} className="mt-14 w-full">
          <p className="mb-4 font-mono text-[11px] tracking-wider text-white/30 uppercase">
            Works with your stack
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
