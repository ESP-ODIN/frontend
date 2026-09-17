import Link from "next/link"

import { Logo } from "@/components/blocks/logo"
import { ResetPasswordForm } from "@/components/blocks/reset-password/reset-password-form"

type ResetPasswordCardProps = {
  token?: string
}

export function ResetPasswordCard({ token }: ResetPasswordCardProps) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-xl border border-muted/40 bg-background-100 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <Logo showName={false} />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Nouveau mot de passe</h1>
        <p className="text-sm text-muted-foreground">
          Choisissez un nouveau mot de passe pour votre compte.
        </p>
      </div>

      <ResetPasswordForm token={token} />

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/log-in" className="font-medium text-primary hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  )
}
