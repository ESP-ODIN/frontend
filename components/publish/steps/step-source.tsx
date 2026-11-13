"use client"

import { StepShell } from "@/components/publish/step-shell"
import { RepoUrlField } from "@/components/publish/fields/repo-url-field"

export function StepSource() {
  return (
    <StepShell
      title="Import your repository"
      description="Link the GitHub repository of your agent. If it contains a manifest.toml, we'll use it; otherwise you'll create one in the next steps."
    >
      <RepoUrlField />
    </StepShell>
  )
}
