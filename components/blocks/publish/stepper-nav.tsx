"use client"

import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { WIZARD_STEPS } from "@/lib/publish/constants"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"

export function StepperNav() {
  const { currentStepIndex, stepValidity, goToStep } = usePublishWizard()

  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {WIZARD_STEPS.map((step, index) => {
        const isDone = index < currentStepIndex && stepValidity[step.id]
        const isActive = index === currentStepIndex
        const isReachable =
          index <= currentStepIndex ||
          WIZARD_STEPS.slice(0, index).every((s) => stepValidity[s.id])

        return (
          <li
            key={step.id}
            className="flex flex-1 items-center gap-2 last:flex-none sm:gap-4"
          >
            <button
              type="button"
              onClick={() => goToStep(index)}
              disabled={!isReachable}
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold transition-all duration-300",
                isDone && "border-primary bg-primary text-primary-foreground",
                isActive && !isDone && "border-primary text-primary",
                !isActive && !isDone && "border-muted/40 text-muted-foreground",
                !isReachable && "cursor-not-allowed opacity-50"
              )}
            >
              {isDone ? (
                <Check className="fx-pop size-3.5" strokeWidth={3} />
              ) : (
                index + 1
              )}
            </button>
            <span
              className={cn(
                "hidden text-xs font-semibold whitespace-nowrap transition-colors sm:inline",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
            {index < WIZARD_STEPS.length - 1 && (
              <span
                className={cn(
                  "h-px flex-1 bg-muted/30 transition-colors duration-300",
                  isDone && "bg-primary"
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
