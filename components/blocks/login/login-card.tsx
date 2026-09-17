import Link from "next/link"

import { Logo } from "@/components/blocks/logo"
import { OAuthButtons } from "@/components/blocks/login/oauth-buttons"
import { LoginForm } from "@/components/blocks/login/login-form"

export function LoginCard() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-xl border border-muted/40 bg-background-100 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <Logo showName={false} />
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
  )
}
