import type { Metadata } from "next"

import { FloatingNav } from "@/components/layout/floating-nav"
import { NotFoundScreen } from "@/components/blocks/status/not-found-screen"
import { appNavLinks } from "@/lib/nav-links"

export const metadata: Metadata = {
  title: "Page not found — Odin",
}

// Root 404: unmatched URLs only get the root layout, so the nav is added here
export default function NotFound() {
  return (
    <main className="pt-24 sm:pt-28">
      <FloatingNav links={appNavLinks} showCta={false} />
      <NotFoundScreen />
    </main>
  )
}
