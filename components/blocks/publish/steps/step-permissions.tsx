"use client"

import { StepShell } from "@/components/blocks/publish/step-shell"
import { InternetAccessToggle } from "@/components/blocks/publish/fields/internet-access-toggle"
import { FilesystemAccessSelect } from "@/components/blocks/publish/fields/filesystem-access-select"
import { TerminalAccessSelect } from "@/components/blocks/publish/fields/terminal-access-select"
import { EnvVarsField } from "@/components/blocks/publish/fields/env-vars-field"
import { PermissionSummary } from "@/components/blocks/publish/fields/permission-summary"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"

export function StepPermissions() {
  const { data } = usePublishWizard()

  return (
    <StepShell
      title="Permissions"
      description="Les accès requis par votre agent, déclarés explicitement."
    >
      <InternetAccessToggle />
      <FilesystemAccessSelect />
      <TerminalAccessSelect />
      <EnvVarsField />
      <div className="flex flex-col gap-2 rounded-2xl border border-muted/40 bg-muted/5 p-4">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Résumé
        </p>
        <PermissionSummary permissions={data.permissions} />
      </div>
    </StepShell>
  )
}
