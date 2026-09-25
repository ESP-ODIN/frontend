import type { LucideIcon } from "lucide-react"

export type AgentTypeId = "workflow" | "autonomous"

export type AgentTypeOption = {
  id: AgentTypeId
  label: string
  description: string
  icon: LucideIcon
}

export type RuntimeId = "python3" | "node" | "binary" | "docker"

export type FilesystemAccess = "none" | "read-only" | "read-write"

export type TerminalAccess = "none" | "restricted" | "full"

export type ManifestSource = "repository" | "form"

export type WizardStepId =
  "source" | "package" | "run" | "permissions" | "review"

export type NameCheckStatus =
  "idle" | "checking" | "available" | "taken" | "error"

export type SourceSection = {
  kind: ManifestSource | ""
  repoUrl: string
  scannedRepoUrl: string
  readmeFile: string
}

export type PackageSection = {
  name: string
  version: string
  description: string
  type: AgentTypeId
  category: string
  tags: string[]
  changelog: string
}

export type RunSection = {
  runtime: RuntimeId | ""
  entrypoint: string
  args: string[]
}

export type TerminalSection = {
  access: TerminalAccess
  commands: string[]
}

export type PermissionsSection = {
  network: boolean
  filesystem: FilesystemAccess
  env: string[]
  terminal: TerminalSection
}

export type PublishFormData = {
  source: SourceSection
  package: PackageSection
  run: RunSection
  permissions: PermissionsSection
}

export type ScannedManifest = {
  package: Partial<PackageSection>
  run: Partial<RunSection>
  permissions: Partial<Omit<PermissionsSection, "terminal">>
  terminal: Partial<TerminalSection>
  readmeFile: string
}

export type Manifest = {
  package: {
    name: string
    version: string
    description: string
    type: AgentTypeId
    category: string
    tags: string[]
    repository: string
    readme: string
    changelog: string
  }
  run: {
    runtime: RuntimeId
    entrypoint: string
    args: string[]
  }
  permissions: {
    network: boolean
    filesystem: FilesystemAccess
    env: string[]
    terminal: {
      access: TerminalAccess
      commands?: string[]
    }
  }
}

export type PublishAgentPayload = {
  manifest: Manifest
  manifest_source: ManifestSource
}
