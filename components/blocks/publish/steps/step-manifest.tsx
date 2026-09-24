"use client"

import { StepShell } from "@/components/blocks/publish/step-shell"
import { ManifestSourceSelector } from "@/components/blocks/publish/fields/manifest-source-selector"
import { RepoUrlField } from "@/components/blocks/publish/fields/repo-url-field"
import { VersionField } from "@/components/blocks/publish/fields/version-field"
import { EntrypointField } from "@/components/blocks/publish/fields/entrypoint-field"
import { HomepageUrlField } from "@/components/blocks/publish/fields/homepage-url-field"
import { ArgsField } from "@/components/blocks/publish/fields/args-field"
import { ChangelogField } from "@/components/blocks/publish/fields/changelog-field"
import { ReadmeEditor } from "@/components/blocks/publish/fields/readme-editor"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"

export function StepManifest() {
  const { data } = usePublishWizard()
  const { source, scannedRepoUrl } = data.manifest
  // In import mode the fields stay hidden until a scan has filled them.
  const showFields =
    source === "form" || (source === "repository" && scannedRepoUrl !== "")

  return (
    <StepShell
      title="Manifest"
      description="Importez votre manifest.toml depuis GitHub, ou créez-le ici."
    >
      <ManifestSourceSelector />
      {source !== "" && <RepoUrlField />}
      {showFields && (
        <div className="flex animate-in flex-col gap-6 duration-300 fade-in-0 slide-in-from-bottom-2">
          <div className="grid gap-6 sm:grid-cols-2">
            <VersionField />
            <EntrypointField />
          </div>
          <HomepageUrlField />
          <ArgsField />
          <ChangelogField />
          <ReadmeEditor />
        </div>
      )}
    </StepShell>
  )
}
