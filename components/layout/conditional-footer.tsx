"use client"

import { usePathname } from "next/navigation"

import { Footer } from "@/components/layout/footer"

const hiddenOn = ["/sign-in", "/log-in", "/forgot-password", "/reset-password"]

export function ConditionalFooter() {
  const pathname = usePathname()

  if (hiddenOn.includes(pathname)) return null

  return <Footer />
}
