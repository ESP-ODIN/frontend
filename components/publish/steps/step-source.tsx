"use client"

import { StepShell } from "@/components/publish/step-shell"
import { ManifestSourceSelector } from "@/components/publish/fields/manifest-source-selector"
import { RepoUrlField } from "@/components/publish/fields/repo-url-field"
import { usePublishWizard } from "@/components/publish/wizard-context"

export function StepSource() {
  const { data } = usePublishWizard()

  return (
    <StepShell
      title="Manifest source"
      description="Import your manifest.toml from GitHub, or build it step by step."
    >
      <ManifestSourceSelector />
      {data.source.kind !== "" && <RepoUrlField />}
    </StepShell>
  )
}
