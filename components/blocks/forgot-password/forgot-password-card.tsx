import Link from "next/link"
import { Mail } from "lucide-react"

import { Logo } from "@/components/blocks/logo"
import { ForgotPasswordForm } from "@/components/blocks/forgot-password/forgot-password-form"
import { SpotlightPanel } from "@/components/motion/spotlight-panel"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

export function ForgotPasswordCard() {
  return (
    <ScrollReveal className="mx-auto w-full max-w-lg">
      <SpotlightPanel className="rounded-3xl">
        <div className="flex flex-col gap-6 rounded-3xl border border-muted/40 bg-background-100 p-6 shadow-xl shadow-black/[0.03] sm:p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <Logo showName={false} />
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 font-mono text-xs tracking-wider text-primary">
              <Mail className="size-3" />
              ACCOUNT RECOVERY
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Forgot password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <ForgotPasswordForm />

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/log-in" className="font-medium text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </SpotlightPanel>
    </ScrollReveal>
  )
}
