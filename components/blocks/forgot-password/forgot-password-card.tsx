import Link from "next/link"

import { Logo } from "@/components/blocks/logo"
import { ForgotPasswordForm } from "@/components/blocks/forgot-password/forgot-password-form"

export function ForgotPasswordCard() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-xl border border-muted/40 bg-background-100 p-6 sm:p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <Logo showName={false} />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Mot de passe oublié</h1>
        <p className="text-sm text-muted-foreground">
          Entrez votre email et nous vous enverrons un lien de réinitialisation.
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/log-in" className="font-medium text-primary hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  )
}
