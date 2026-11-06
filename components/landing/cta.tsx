import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AuroraBackground } from "@/components/motion/aurora-background"
import { Magnetic } from "@/components/motion/magnetic"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

type CtaProps = {
  className?: string
}

export function Cta({ className }: CtaProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-[#100d09] px-6 py-16 text-center sm:py-24",
        className
      )}
    >
      <AuroraBackground className="opacity-70" />

      <div className="relative flex flex-col items-center gap-6">
        <ScrollReveal>
          <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ship your first agent before lunch.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <p className="max-w-2xl text-white/50">
            Free for individual authors and open source agents. No credit card. Pick your model
            provider.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={160} className="flex flex-col items-center gap-3 sm:flex-row">
          <div className="relative">
            <span className="fx-pulse-ring absolute inset-0 rounded-full bg-primary/60" aria-hidden />
            <Magnetic>
              <Button
                size="lg"
                className="fx-shine relative rounded-full px-6"
                icon={ArrowRight}
                iconPosition="right"
                render={<Link href="/docs/install" />}
              >
                Get the CLI
              </Button>
            </Magnetic>
          </div>
          <Magnetic>
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full border border-white/15 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
              render={<Link href="/docs" />}
            >
              Read the documentation
            </Button>
          </Magnetic>
        </ScrollReveal>
      </div>
    </div>
  )
}
