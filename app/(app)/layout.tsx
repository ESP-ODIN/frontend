import { FloatingNav } from "@/components/layout/floating-nav"
import { getSessionAccount, isAuthenticated } from "@/lib/auth/session"
import { appNavLinks } from "@/lib/navigation/nav-links"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="pt-24 sm:pt-28">
      <FloatingNav links={appNavLinks} showCta={false} isLoggedIn={await isAuthenticated()} accountEmail={(await getSessionAccount())?.email} />
      {children}
    </main>
  )
}
