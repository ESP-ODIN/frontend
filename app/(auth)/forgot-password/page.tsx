import type { Metadata } from "next"

import { ForgotPasswordCard } from "@/components/blocks/forgot-password/forgot-password-card"

export const metadata: Metadata = {
  title: "Mot de passe oublié — Odin",
  description: "Réinitialisez le mot de passe de votre compte Odin.",
}

export default function Page() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <ForgotPasswordCard />
    </div>
  )
}
