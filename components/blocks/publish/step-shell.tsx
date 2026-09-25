"use client"

import type { ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StepTransition } from "@/components/blocks/publish/step-transition"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"

type StepShellProps = {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode | null
}

export function StepShell({
  title,
  description,
  children,
  footer,
}: StepShellProps) {
  const { currentStepIndex, currentStepId, goBack, goNext, stepValidity } =
    usePublishWizard()
  const isFirst = currentStepIndex === 0

  return (
    <StepTransition stepKey={currentStepId}>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-col gap-6">{children}</div>

        <div className="flex items-center justify-between border-t border-muted/40 pt-6">
          <Button
            type="button"
            variant="outline"
            icon={ChevronLeft}
            onClick={goBack}
            disabled={isFirst}
            className="rounded-lg"
          >
            Retour
          </Button>
          {footer !== undefined ? (
            footer
          ) : (
            <Button
              type="button"
              icon={ChevronRight}
              iconPosition="right"
              onClick={goNext}
              disabled={!stepValidity[currentStepId]}
              className="rounded-lg"
            >
              Continuer
            </Button>
          )}
        </div>
      </div>
    </StepTransition>
  )
}
