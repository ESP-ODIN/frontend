"use client"

import { StepShell } from "@/components/blocks/publish/step-shell"
import { FormSection } from "@/components/blocks/publish/form-section"
import { RuntimeSelect } from "@/components/blocks/publish/fields/runtime-select"
import { EntrypointField } from "@/components/blocks/publish/fields/entrypoint-field"
import { ArgsField } from "@/components/blocks/publish/fields/args-field"

export function StepRun() {
  return (
    <StepShell
      title="Run"
      description="How Odin starts your agent."
    >
      <FormSection title="Launch" table="run">
        <div className="grid gap-6 sm:grid-cols-2">
          <RuntimeSelect />
          <EntrypointField />
        </div>
        <ArgsField />
      </FormSection>
    </StepShell>
  )
}
