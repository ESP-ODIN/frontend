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

// "repository": manifest.toml scanned from the GitHub repo.
// "form": the owner has no manifest.toml — the form content is stored backend-side instead.
export type ManifestSource = "repository" | "form"

export type WizardStepId = "general" | "manifest" | "permissions" | "review"

export type NameCheckStatus =
  "idle" | "checking" | "available" | "taken" | "error"

export type GeneralInfo = {
  packageName: string
  description: string
  type: AgentTypeId
  tags: string[]
  runtime: RuntimeId | ""
  category: string
}

export type ManifestInfo = {
  source: ManifestSource | ""
  repoUrl: string
  /** Repo URL the current field values were scanned from — empty until a scan succeeds. */
  scannedRepoUrl: string
  version: string
  entrypoint: string
  args: string[]
  changelog: string
  readme: string
  homepageUrl: string
}

export type PermissionsInfo = {
  internetAccess: boolean
  filesystemAccess: FilesystemAccess
  terminalAccess: TerminalAccess
  /** Only meaningful when terminalAccess is "restricted". */
  allowedCommands: string[]
  envVars: string[]
}

export type PublishFormData = {
  general: GeneralInfo
  manifest: ManifestInfo
  permissions: PermissionsInfo
}

// Request body of the backend's publish route — snake_case, matching the API DTO.
// Keep this in sync with the backend, not with the form's shape.
// No creator_id on purpose: the backend takes the creator from the auth token,
// otherwise any client could publish under someone else's account.
export type PublishAgentPayload = {
  name: string
  description: string
  agent_type: AgentTypeId
  category: string
  runtime: RuntimeId
  tags: string[]
  readme_markdown: string
  repository_url: string
  homepage_url: string | null
  /** "form" = the owner has no manifest.toml, the backend stores the manifest itself. */
  manifest_source: ManifestSource
  version: {
    number: string
    changelog_markdown: string
    entrypoint: string
    args: string[]
  }
  permissions: {
    network: boolean
    filesystem: FilesystemAccess
    terminal: {
      access: TerminalAccess
      /** Empty unless access is "restricted". */
      commands: string[]
    }
    env_vars: string[]
  }
}
