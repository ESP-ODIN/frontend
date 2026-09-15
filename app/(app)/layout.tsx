import { Nav } from "@/components/layout/nav"
import { Separator } from "@/components/ui/separator"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main>
      <Nav />
      <Separator />
      {children}
    </main>
  )
}
