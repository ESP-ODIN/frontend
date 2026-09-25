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

export type WizardStepId =
  "source" | "package" | "run" | "permissions" | "review"

export type NameCheckStatus =
  "idle" | "checking" | "available" | "taken" | "error"

// The form mirrors manifest.toml: one section per table, keys named after the TOML keys,
// so building the manifest is a straight copy (see manifest-toml.ts).

/** Where the manifest comes from — submission metadata, not part of manifest.toml. */
export type SourceSection = {
  kind: ManifestSource | ""
  repoUrl: string
  /** Repo URL the current field values were scanned from — empty until a scan succeeds. */
  scannedRepoUrl: string
  /** Repo-relative path written as `readme` in [package] — the README is read from the repo. */
  readmeFile: string
}

/** [package] — `repository` and `readme` come from the source step (see buildManifest). */
export type PackageSection = {
  name: string
  version: string
  description: string
  type: AgentTypeId
  category: string
  tags: string[]
  /** Markdown notes for this version, stored as-is in the manifest (no CHANGELOG.md). */
  changelog: string
}

/** [run] */
export type RunSection = {
  runtime: RuntimeId | ""
  entrypoint: string
  args: string[]
}

/** [permissions.terminal] */
export type TerminalSection = {
  access: TerminalAccess
  /** Only meaningful when access is "restricted". */
  commands: string[]
}

/** [permissions] */
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

// Exactly what manifest.toml contains — produced from the form for the recap and the backend.
export type Manifest = {
  package: {
    name: string
    version: string
    description: string
    type: AgentTypeId
    category: string
    tags: string[]
    repository: string
    /** Repo-relative path — the README is read straight from the GitHub repo. */
    readme: string
    /** Markdown content, not a file path. */
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
      /** Omitted unless access is "restricted". */
      commands?: string[]
    }
  }
}

// Request body of the backend's publish route — snake_case, matching the API DTO.
// Keep this in sync with the backend, not with the form's shape.
// No creator_id on purpose: the backend takes the creator from the auth token,
// otherwise any client could publish under someone else's account.
export type PublishAgentPayload = {
  /** Same shape as manifest.toml, whichever source it came from. */
  manifest: Manifest
  /** "form" = the owner has no manifest.toml, the backend stores the manifest itself. */
  manifest_source: ManifestSource
}
