import { MAX_TAGS } from "./constants"
import type {
  GeneralInfo,
  ManifestInfo,
  NameCheckStatus,
  PermissionsInfo,
  PublishFormData,
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

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export function isGeneralStepValid(
  general: GeneralInfo,
  nameCheckStatus: NameCheckStatus
): boolean {
  return (
    isPackageNameFormatValid(general.packageName) &&
    nameCheckStatus === "available" &&
    general.description.trim().length > 0 &&
    general.description.length <= 120 &&
    general.tags.length <= MAX_TAGS &&
    general.type.length > 0 &&
    general.runtime.length > 0 &&
    general.category.length > 0
  )
}

// In "repository" mode the fields must come from a scan of the *current* repo URL,
// so editing the URL after a scan forces a re-scan before moving on.
export function isManifestSourceReady(manifest: ManifestInfo): boolean {
  if (manifest.source === "repository")
    return manifest.scannedRepoUrl === manifest.repoUrl
  return manifest.source === "form"
}

export function isManifestStepValid(manifest: ManifestInfo): boolean {
  return (
    isGithubRepoUrlValid(manifest.repoUrl) &&
    isManifestSourceReady(manifest) &&
    isSemverValid(manifest.version) &&
    manifest.entrypoint.trim().length > 0 &&
    manifest.changelog.trim().length > 0
  )
}

export function isTerminalAccessValid(permissions: PermissionsInfo): boolean {
  return (
    permissions.terminalAccess !== "restricted" ||
    permissions.allowedCommands.length > 0
  )
}

export function isPermissionsStepValid(permissions: PermissionsInfo): boolean {
  const declaresSomething =
    permissions.internetAccess ||
    permissions.filesystemAccess !== "none" ||
    permissions.terminalAccess !== "none" ||
    permissions.envVars.length > 0
  return declaresSomething && isTerminalAccessValid(permissions)
}

export type ChecklistItem = { id: string; label: string; done: boolean }

export function getChecklistItems(
  data: PublishFormData,
  nameCheckStatus: NameCheckStatus
): ChecklistItem[] {
  const { general, manifest, permissions } = data

  return [
    {
      id: "name",
      label: "Nom du package valide et disponible",
      done:
        isPackageNameFormatValid(general.packageName) &&
        nameCheckStatus === "available",
    },
    {
      id: "description",
      label: "Description renseignée",
      done:
        general.description.trim().length > 0 &&
        general.description.length <= 120,
    },
    {
      id: "type",
      label: "Type d'agent sélectionné",
      done: general.type.length > 0,
    },
    {
      id: "runtime",
      label: "Runtime déclaré",
      done: general.runtime.length > 0,
    },
    {
      id: "category",
      label: "Catégorie sélectionnée",
      done: general.category.length > 0,
    },
    {
      id: "repo",
      label: "Lien du repo GitHub renseigné",
      done: isGithubRepoUrlValid(manifest.repoUrl),
    },
    {
      id: "manifest",
      label: "Manifest importé ou créé",
      done: isManifestSourceReady(manifest),
    },
    {
      id: "version",
      label: "Version au format semver",
      done: isSemverValid(manifest.version),
    },
    {
      id: "changelog",
      label: "Changelog rédigé",
      done: manifest.changelog.trim().length > 0,
    },
    {
      id: "permissions",
      label: "Permissions déclarées",
      done: isPermissionsStepValid(permissions),
    },
  ]
}
