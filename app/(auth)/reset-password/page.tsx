import type { Metadata } from "next"

import { ResetPasswordCard } from "@/components/blocks/reset-password/reset-password-card"

export const metadata: Metadata = {
  title: "Reset password — Odin",
  description: "Choose a new password for your Odin account.",
}

type PageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const { token } = await searchParams

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <ResetPasswordCard token={token} />
    </div>
  )
}
