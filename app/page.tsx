// Landing Page

import { Nav } from '@/components/blocks/landing/nav'
import { Separator } from '@/components/ui/separator'
import { Hero } from '@/components/blocks/landing/hero'
import { Stats } from '@/components/blocks/landing/stats'
import { Terminal } from '@/components/blocks/terminal'
import { Values } from '@/components/blocks/landing/values'
import { HowItWorks } from '@/components/blocks/landing/how-it-works'
import { Platform } from '@/components/blocks/landing/platform'
import { FeaturedAgents } from '@/components/blocks/landing/featured-agents'
import { Cta } from '@/components/blocks/landing/cta'

export default function Page() {
  return (
    <main>
        <Nav />
        <Separator />
        <div className="flex flex-col gap-14 sm:gap-20">
            <Hero />
            <Stats />
            <Terminal />
            <Values />
            <HowItWorks />
            <Platform />
            <FeaturedAgents />
            <Cta />
        </div>
    </main>

  )
}
