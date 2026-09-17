import { FloatingNav } from "@/components/layout/floating-nav"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="pt-24 sm:pt-28">
      <FloatingNav minimal />
      {children}
    </main>
  )
}
