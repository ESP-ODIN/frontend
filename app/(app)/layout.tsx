import { FloatingNav } from "@/components/layout/floating-nav"
import { isAuthenticated } from "@/lib/auth/session"
import { getAccountDisplay } from "@/lib/auth/current-user"
import { appNavLinks } from "@/lib/navigation/nav-links"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="pt-24 sm:pt-28">
      <FloatingNav links={appNavLinks} showCta={false} isLoggedIn={await isAuthenticated()} account={await getAccountDisplay()} />
      {children}
    </main>
  )
}
