import { ScrollReveal } from "@/components/motion/scroll-reveal"

const stats = [
  {
    value: "+184",
    label: "This week",
  },
  {
    value: "14.2M",
    label: "Installs / Month",
  },
  {
    value: "99.98%",
    label: "Signed packages",
  },
]

export function Hero() {
  return (
    <div className="flex flex-col gap-8 mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
        <ScrollReveal className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 font-mono text-xs tracking-wider text-primary">
              <span className="fx-live-dot size-1.5 rounded-full bg-primary" />
                MARKETPLACE
            </span>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Find your <span className="fx-gradient-text">next agent</span>.
            </h1>
            <p className="max-w-md text-foreground/60">2,481 agents from over 38,000 authors. Read field reports, check permissions, install with a single command.</p>
        </ScrollReveal>
        <ScrollReveal delay={120} className="flex flex-wrap items-end justify-center gap-6 sm:gap-8 lg:justify-start">
            {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-2 lg:items-start">
                    <p className="text-xl font-bold whitespace-nowrap">{stat.value}</p>
                    <p className="text-sm text-foreground/60 whitespace-nowrap">{stat.label}</p>
                </div>
            ))}
        </ScrollReveal>
    </div>
  )
}
