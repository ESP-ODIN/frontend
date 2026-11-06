import type { Metadata } from "next"

import { LoginCard } from "@/components/auth/login/login-card"
import { safeRedirectPath } from "@/lib/auth/redirect"

type PageProps = {
  searchParams: Promise<{ next?: string | string[] }>
}

export const metadata: Metadata = {
  title: "Log in — Odin",
  description: "Log in to your Odin account.",
}

export default async function Page({ searchParams }: PageProps) {
  const { next } = await searchParams

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <LoginCard redirectTo={safeRedirectPath(next)} />
    </div>
  )
}
