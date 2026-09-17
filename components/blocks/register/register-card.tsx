import Link from "next/link"
import { Sparkles } from "lucide-react"

import { Logo } from "@/components/blocks/logo"
import { OAuthButtons } from "@/components/blocks/register/oauth-buttons"
import { RegisterForm } from "@/components/blocks/register/register-form"
import { SpotlightPanel } from "@/components/motion/spotlight-panel"
import { ScrollReveal } from "@/components/motion/scroll-reveal"

export function RegisterCard() {
  return (
    <ScrollReveal className="mx-auto w-full max-w-lg">
      <SpotlightPanel className="rounded-3xl">
        <div className="flex flex-col gap-6 rounded-3xl border border-muted/40 bg-background-100 p-6 shadow-xl shadow-black/[0.03] sm:p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <Logo showName={false} />
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 font-mono text-xs tracking-wider text-primary">
              <Sparkles className="size-3" />
              REJOINDRE ODIN
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Créer un compte</h1>
            <p className="text-sm text-muted-foreground">
              Rejoignez Odin pour publier et installer des agents.
            </p>
          </div>

          <OAuthButtons />

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-muted/30" />
            <span className="text-xs tracking-wider text-muted-foreground uppercase">ou</span>
            <span className="h-px flex-1 bg-muted/30" />
          </div>

          <RegisterForm />

          <p className="text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link href="/log-in" className="font-medium text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </SpotlightPanel>
    </ScrollReveal>
  )
}
