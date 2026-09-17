import Link from "next/link"
import { Lock } from "lucide-react"

import { Logo } from "@/components/blocks/logo"
import { OAuthButtons } from "@/components/blocks/login/oauth-buttons"
import { LoginForm } from "@/components/blocks/login/login-form"
import { SpotlightPanel } from "@/components/motion/spotlight-panel"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

export function LoginCard() {
  return (
    <ScrollReveal className="mx-auto w-full max-w-lg">
      <SpotlightPanel className="rounded-3xl">
        <div className="flex flex-col gap-6 rounded-3xl border border-muted/40 bg-background-100 p-6 shadow-xl shadow-black/[0.03] sm:p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <Logo showName={false} />
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 font-mono text-xs tracking-wider text-primary">
              <Lock className="size-3" />
              ACCÈS SÉCURISÉ
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Se connecter</h1>
            <p className="text-sm text-muted-foreground">
              Connectez-vous à Odin pour retrouver vos agents.
            </p>
          </div>

          <OAuthButtons />

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-muted/30" />
            <span className="text-xs tracking-wider text-muted-foreground uppercase">ou</span>
            <span className="h-px flex-1 bg-muted/30" />
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            Vous n&apos;avez pas de compte ?{" "}
            <Link href="/sign-in" className="font-medium text-primary hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </SpotlightPanel>
    </ScrollReveal>
  )
}
