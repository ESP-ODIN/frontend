import type { Metadata } from "next"

import { LoginCard } from "@/components/blocks/login/login-card"

export const metadata: Metadata = {
  title: "Se connecter — Odin",
  description: "Connectez-vous à votre compte Odin.",
}

export default function Page() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <LoginCard />
    </div>
  )
}
