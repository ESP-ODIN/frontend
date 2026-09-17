import type { Metadata } from "next"

import { RegisterCard } from "@/components/blocks/register/register-card"

export const metadata: Metadata = {
  title: "Créer un compte — Odin",
  description: "Créez votre compte Odin pour publier et installer des agents IA.",
}

export default function Page() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <RegisterCard />
    </div>
  )
}
