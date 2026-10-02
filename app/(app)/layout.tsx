import { FloatingNav } from "@/components/layout/floating-nav"

const links = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Community", href: "/community" },
  { label: "CLI", href: "/docs/cli" },
  { label: "Docs", href: "/docs" },
  { label: "About", href: "/about" },
]

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="pt-24 sm:pt-28">
      <FloatingNav links={links} showCta={false} />
      {children}
    </main>
  )
}
