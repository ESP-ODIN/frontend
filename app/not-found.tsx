import type { Metadata } from "next"

import { FloatingNav } from "@/components/layout/floating-nav"
import { NotFoundScreen } from "@/components/status/not-found-screen"
import { appNavLinks } from "@/lib/navigation/nav-links"

export const metadata: Metadata = {
  title: "Page not found — Odin",
}

export default function NotFound() {
  return (
    <main className="pt-24 sm:pt-28">
      <FloatingNav links={appNavLinks} showCta={false} />
      <NotFoundScreen />
    </main>
  )
}
