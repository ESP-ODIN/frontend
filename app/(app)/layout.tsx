import { FloatingNav } from "@/components/layout/floating-nav"
import { appNavLinks } from "@/lib/navigation/nav-links"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="pt-24 sm:pt-28">
      <FloatingNav links={appNavLinks} showCta={false} />
      {children}
    </main>
  )
}
