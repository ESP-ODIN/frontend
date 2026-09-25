import { MAX_TAGS } from "./constants"
import type {
  NameCheckStatus,
  PackageSection,
  PermissionsSection,
  PublishFormData,
  RunSection,
  SourceSection,
  TerminalSection,
} from "./types"

export const PACKAGE_NAME_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/
export const SEMVER_REGEX =
  /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/
export const GITHUB_REPO_URL_REGEX =
  /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+?(?:\.git)?\/?$/
export const COMMAND_NAME_REGEX = /^[\w.+-]+$/
export const ENV_VAR_NAME_REGEX = /^[A-Z][A-Z0-9_]*$/

export function isPackageNameFormatValid(name: string): boolean {
  return PACKAGE_NAME_REGEX.test(name)
}

export function isSemverValid(version: string): boolean {
  return SEMVER_REGEX.test(version)
}

export function isGithubRepoUrlValid(url: string): boolean {
  return GITHUB_REPO_URL_REGEX.test(url.trim())
}

export function isCommandNameValid(command: string): boolean {
  return COMMAND_NAME_REGEX.test(command)
}

export function isEnvVarNameValid(name: string): boolean {
  return ENV_VAR_NAME_REGEX.test(name)
}

export function isManifestSourceReady(source: SourceSection): boolean {
  if (source.kind === "repository")
    return source.scannedRepoUrl === source.repoUrl
  return source.kind === "form"
}

export function isSourceStepValid(source: SourceSection): boolean {
  return isGithubRepoUrlValid(source.repoUrl) && isManifestSourceReady(source)
}

export function isDescriptionValid(description: string): boolean {
  return description.trim().length > 0 && description.length <= 120
}

export function isPackageStepValid(
  pkg: PackageSection,
  nameCheckStatus: NameCheckStatus
): boolean {
  return (
    isPackageNameFormatValid(pkg.name) &&
    nameCheckStatus === "available" &&
    isSemverValid(pkg.version) &&
    isDescriptionValid(pkg.description) &&
    pkg.type.length > 0 &&
    pkg.category.length > 0 &&
    pkg.tags.length <= MAX_TAGS &&
    pkg.changelog.trim().length > 0
  )
}

export function isRunStepValid(run: RunSection): boolean {
  return run.runtime.length > 0 && run.entrypoint.trim().length > 0
}

export function isTerminalAccessValid(terminal: TerminalSection): boolean {
  return terminal.access !== "restricted" || terminal.commands.length > 0
}

export function isPermissionsStepValid(
  permissions: PermissionsSection
): boolean {
  const declaresSomething =
    permissions.network ||
    permissions.filesystem !== "none" ||
    permissions.terminal.access !== "none" ||
    permissions.env.length > 0
  return declaresSomething && isTerminalAccessValid(permissions.terminal)
}

export type ChecklistItem = { id: string; label: string; done: boolean }

export function getChecklistItems(
  data: PublishFormData,
  nameCheckStatus: NameCheckStatus
): ChecklistItem[] {
  const { source, package: pkg, run, permissions } = data

  return [
    {
      id: "repo",
      label: "GitHub repo link provided",
      done: isGithubRepoUrlValid(source.repoUrl),
    },
    {
      id: "manifest",
      label: "Manifest imported or created",
      done: isManifestSourceReady(source),
    },
    {
      id: "name",
      label: "Package name valid and available",
      done:
        isPackageNameFormatValid(pkg.name) && nameCheckStatus === "available",
    },
    {
      id: "version",
      label: "Version in semver format",
      done: isSemverValid(pkg.version),
    },
    {
      id: "description",
      label: "Description provided",
      done: isDescriptionValid(pkg.description),
    },
    {
      id: "category",
      label: "Category selected",
      done: pkg.category.length > 0,
    },
    {
      id: "changelog",
      label: "Changelog written",
      done: pkg.changelog.trim().length > 0,
    },
    {
      id: "runtime",
      label: "Runtime declared",
      done: run.runtime.length > 0,
    },
    {
      id: "entrypoint",
      label: "Entrypoint provided",
      done: run.entrypoint.trim().length > 0,
    },
    {
      id: "permissions",
      label: "Permissions declared",
      done: isPermissionsStepValid(permissions),
    },
  ]
}
