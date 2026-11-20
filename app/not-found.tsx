import type { Metadata } from "next"

import { FloatingNav } from "@/components/layout/floating-nav"
import { isAuthenticated } from "@/lib/auth/session"
import { getAccountDisplay } from "@/lib/auth/current-user"
import { NotFoundScreen } from "@/components/status/not-found-screen"
import { appNavLinks } from "@/lib/navigation/nav-links"

export const metadata: Metadata = {
  title: "Page not found — Odin",
}

export default async function NotFound() {
  return (
    <main className="pt-24 sm:pt-28">
      <FloatingNav links={appNavLinks} showCta={false} isLoggedIn={await isAuthenticated()} account={await getAccountDisplay()} />
      <NotFoundScreen />
    </main>
  )
}
