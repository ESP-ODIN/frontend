import type { Metadata } from "next"

import { ForgotPasswordCard } from "@/components/auth/forgot-password/forgot-password-card"

export const metadata: Metadata = {
  title: "Forgot password — Odin",
  description: "Reset the password for your Odin account.",
}

export default function Page() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <ForgotPasswordCard />
    </div>
  )
}
