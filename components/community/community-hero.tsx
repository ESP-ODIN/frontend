import { AuroraBackground } from "@/components/motion/aurora-background"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

export function CommunityHero() {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-muted/30 bg-background-100 px-5 py-8 text-center sm:px-6 sm:py-16">
      <AuroraBackground className="opacity-40" />
      <ScrollReveal className="relative flex flex-col items-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 font-mono text-xs tracking-wider text-primary">
          <span className="fx-live-dot size-1.5 rounded-full bg-primary" />
          SOCIAL NETWORK
        </span>
        <h1 className="max-w-2xl text-3xl font-bold text-balance sm:text-5xl">
          What the community is{" "}
          <span className="fx-gradient-text">learning</span>.
        </h1>
        <p className="max-w-lg text-sm text-foreground/60 sm:text-base">
          Field reports, tutorials and questions from people running agents in
          production — from the creators you follow and the ones you should.
        </p>
      </ScrollReveal>
    </section>
  )
}
