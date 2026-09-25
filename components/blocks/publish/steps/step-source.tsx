"use client"

import { StepShell } from "@/components/blocks/publish/step-shell"
import { ManifestSourceSelector } from "@/components/blocks/publish/fields/manifest-source-selector"
import { RepoUrlField } from "@/components/blocks/publish/fields/repo-url-field"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"

export function StepSource() {
  const { data } = usePublishWizard()

  return (
    <StepShell
      title="Source du manifest"
      description="Importez votre manifest.toml depuis GitHub, ou créez-le étape par étape."
    >
      <ManifestSourceSelector />
      {data.source.kind !== "" && <RepoUrlField />}
    </StepShell>
  )
}
