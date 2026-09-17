import { FloatingNav } from "@/components/layout/floating-nav"

const links = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Réseau Social", href: "/community" },
  { label: "CLI", href: "/docs/cli" },
  { label: "Docs", href: "/docs" },
  { label: "À propos", href: "/about" },
]

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="pt-24 sm:pt-28">
      <FloatingNav links={links} ctaHref="/marketplace" />
      {children}
    </main>
  )
}
