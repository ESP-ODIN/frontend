"use client"

import {
  PublishWizardProvider,
  usePublishWizard,
} from "@/components/blocks/publish/wizard-context"
import { StepperNav } from "@/components/blocks/publish/stepper-nav"
import { StepGeneral } from "@/components/blocks/publish/steps/step-general"
import { StepManifest } from "@/components/blocks/publish/steps/step-manifest"
import { StepPermissions } from "@/components/blocks/publish/steps/step-permissions"
import { StepReview } from "@/components/blocks/publish/steps/step-review"
import { WizardSidebar } from "@/components/blocks/publish/sidebar/wizard-sidebar"
import type { PublishDraft } from "@/lib/publish/url-state"

function WizardSteps() {
  const { currentStepId } = usePublishWizard()

  switch (currentStepId) {
    case "general":
      return <StepGeneral />
    case "manifest":
      return <StepManifest />
    case "permissions":
      return <StepPermissions />
    case "review":
      return <StepReview />
  }
}

export function PublishWizard({
  initialDraft,
}: {
  initialDraft: PublishDraft | null
}) {
  return (
    <PublishWizardProvider initialDraft={initialDraft}>
      <div className="flex flex-col gap-8">
        <StepperNav />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 rounded-3xl border border-muted/40 bg-background-100 p-6 sm:p-8">
            <WizardSteps />
          </div>
          <WizardSidebar />
        </div>
      </div>
    </PublishWizardProvider>
  )
}
