import type { Metadata } from "next"

import { LoginCard } from "@/components/blocks/login/login-card"

export const metadata: Metadata = {
  title: "Log in — Odin",
  description: "Log in to your Odin account.",
}

export default function Page() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <LoginCard />
    </div>
  )
}
