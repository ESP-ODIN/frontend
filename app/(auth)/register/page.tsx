import type { Metadata } from "next"

import { RegisterCard } from "@/components/auth/register/register-card"

export const metadata: Metadata = {
  title: "Create an account — Odin",
  description: "Create your Odin account to publish and install AI agents.",
}

export default function Page() {
  return (
    <div className="flex items-center justify-center">
      <RegisterCard />
    </div>
  )
}
