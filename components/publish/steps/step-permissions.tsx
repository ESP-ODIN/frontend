"use client"

import { StepShell } from "@/components/publish/step-shell"
import { FormSection } from "@/components/publish/form-section"
import { InternetAccessToggle } from "@/components/publish/fields/internet-access-toggle"
import { FilesystemAccessSelect } from "@/components/publish/fields/filesystem-access-select"
import { TerminalAccessSelect } from "@/components/publish/fields/terminal-access-select"
import { EnvVarsField } from "@/components/publish/fields/env-vars-field"
import { PermissionSummary } from "@/components/publish/fields/permission-summary"
import { usePublishWizard } from "@/components/publish/wizard-context"
import { DevMark } from "@/components/dev/dev-mark"
import { PUBLISH_MISSING_NOTES } from "@/lib/publish/dev-notes"

export function StepPermissions() {
  const { data } = usePublishWizard()

  return (
    <StepShell
      title="Permissions"
      description="The access your agent requires, declared explicitly."
    >
      <FormSection
        title="System access"
        table="permissions"
        aside={
          <DevMark kind="missing" note={PUBLISH_MISSING_NOTES.permissions} />
        }
      >
        <InternetAccessToggle />
        <FilesystemAccessSelect />
        <EnvVarsField />
      </FormSection>

      <FormSection
        title="Terminal"
        table="permissions.terminal"
        aside={
          <DevMark kind="missing" note={PUBLISH_MISSING_NOTES.permissions} />
        }
      >
        <TerminalAccessSelect />
      </FormSection>

      <div className="flex flex-col gap-2 rounded-2xl border border-muted/40 bg-muted/5 p-4">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Summary
        </p>
        <PermissionSummary permissions={data.permissions} />
      </div>
    </StepShell>
  )
}
