"use client"

import Link from "next/link"
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { SECURITY_REVIEW } from "@/lib/publish/constants"

export function PublishResult() {
  const { submission, setSubmission } = usePublishWizard()

  if (submission.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Envoi en cours...
      </div>
    )
  }

  if (submission.status === "success") {
    return (
      <div className="fx-pop flex flex-col items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
        <ShieldCheck className="size-8 text-primary" />
        <p className="font-heading text-lg font-bold text-foreground">
          Agent soumis !
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-mono text-foreground">{submission.slug}</span>{" "}
          est en cours de vérification de sécurité (environ{" "}
          {SECURITY_REVIEW.estimatedDuration}). Vous recevrez un email dès
          qu&apos;il sera publié, ou si un problème est détecté.
        </p>
        <Button render={<Link href="/marketplace" />} className="rounded-lg">
          Retour au marketplace
        </Button>
      </div>
    )
  }

  if (submission.status === "error") {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-4" />
          <p className="text-sm font-medium">{submission.message}</p>
        </div>
        <Button
          variant="outline"
          className="rounded-lg"
          onClick={() => setSubmission({ status: "idle" })}
        >
          Réessayer
        </Button>
      </div>
    )
  }

  return null
}
