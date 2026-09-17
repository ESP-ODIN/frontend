import { AuroraBackground } from "@/components/motion/aurora-background"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <AuroraBackground className="opacity-40" />
      </div>
      <main className="relative py-16">{children}</main>
    </div>
  )
}
