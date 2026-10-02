import type { Metadata } from "next"

import { RegisterCard } from "@/components/blocks/register/register-card"

export const metadata: Metadata = {
  title: "Create an account — Odin",
  description: "Create your Odin account to publish and install AI agents.",
}

export default function Page() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <RegisterCard />
    </div>
  )
}
