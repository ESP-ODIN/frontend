"use client"

import Link from "next/link"
import { Clock, Mail, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { SECURITY_REVIEW } from "@/lib/publish/constants"

type SecurityReviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  slug: string
}

export function SecurityReviewDialog({
  open,
  onOpenChange,
  slug,
}: SecurityReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        className="gap-5 border-2 border-primary/40 shadow-2xl shadow-primary/20 sm:max-w-lg"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="fx-pop flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <ShieldCheck className="size-7" />
          </div>
          <DialogTitle className="font-heading text-xl font-bold">
            Votre agent part en vérification
          </DialogTitle>
          <DialogDescription>
            Avant d&apos;apparaître sur le marketplace,{" "}
            <span className="font-mono font-semibold text-foreground">
              {slug}
            </span>{" "}
            passe par notre pipeline de tests de sécurité. Il n&apos;est pas
            encore publié.
          </DialogDescription>
        </div>

        <ol className="flex flex-col gap-2 rounded-2xl border border-muted/40 bg-muted/5 p-4">
          {SECURITY_REVIEW.checks.map((check, index) => (
            <li key={check} className="flex items-center gap-3 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/40 font-mono text-xs font-bold text-primary">
                {index + 1}
              </span>
              <span className="text-foreground">{check}</span>
            </li>
          ))}
        </ol>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Durée estimée</p>
              <p className="font-heading text-base font-bold text-foreground">
                {SECURITY_REVIEW.estimatedDuration}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-xs text-foreground">
              Vous recevrez un email dès que l&apos;agent est publié, ou si un
              problème est détecté.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            className="rounded-lg"
            render={<Link href="/marketplace" />}
          >
            Retour au marketplace
          </Button>
          <Button className="rounded-lg" onClick={() => onOpenChange(false)}>
            J&apos;ai compris
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
