import { parse, TomlError } from "smol-toml"

import { categories } from "@/lib/data/categories"
import {
  AGENT_TYPE_OPTIONS,
  FILESYSTEM_ACCESS_OPTIONS,
  MAX_TAGS,
  RUNTIME_OPTIONS,
  TERMINAL_ACCESS_OPTIONS,
} from "./constants"
import type { GeneralInfo, ManifestInfo, PermissionsInfo } from "./types"
import {
  isCommandNameValid,
  isEnvVarNameValid,
  isPackageNameFormatValid,
  isSemverValid,
  isValidHttpUrl,
} from "./validation"

// Reads a manifest.toml into the form's shape. Every key is optional: a missing key
// leaves the field empty, an invalid one is skipped and reported as a warning, so a
// half-valid manifest still prefills everything it can.
//
// Expected format:
//   [package]  name, version, description, type, category, tags, homepage, readme, changelog
//   [run]      runtime, entrypoint, args
//   [permissions]           network, filesystem, env
//   [permissions.terminal]  access, commands

export type ScannedManifest = {
  general: Partial<
    Pick<
      GeneralInfo,
      "packageName" | "description" | "type" | "category" | "tags" | "runtime"
    >
  >
  manifest: Partial<
    Pick<ManifestInfo, "version" | "entrypoint" | "args" | "homepageUrl">
  >
  permissions: Partial<PermissionsInfo>
  /** Repo-relative paths of the files whose content fills the README / changelog. */
  files: { readme: string; changelog: string }
}

export type ManifestParseResult = {
  scanned: ScannedManifest
  warnings: string[]
}

export class ManifestSyntaxError extends Error {}

type Table = Record<string, unknown>

function table(value: unknown): Table {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Table)
    : {}
}

export function parseManifestToml(source: string): ManifestParseResult {
  let root: Table
  try {
    root = parse(source) as Table
  } catch (error) {
    const where = error instanceof TomlError ? ` (ligne ${error.line})` : ""
    throw new ManifestSyntaxError(`manifest.toml invalide${where}.`)
  }

  const warnings: string[] = []
  const pkg = table(root.package)
  const run = table(root.run)
  const perms = table(root.permissions)
  const terminal = table(perms.terminal)

  // Each reader returns undefined when the key is absent (silently) or invalid (with a warning).
  function read<T>(
    key: string,
    value: unknown,
    accept: (value: unknown) => value is T,
    expected: string
  ): T | undefined {
    if (value === undefined) return undefined
    if (accept(value)) return value
    warnings.push(`« ${key} » ignoré : ${expected}.`)
    return undefined
  }

  const isString = (value: unknown): value is string =>
    typeof value === "string"
  const isStringMatching =
    (test: (value: string) => boolean) =>
    (value: unknown): value is string =>
      typeof value === "string" && test(value)
  const isOneOf =
    <T extends string>(allowed: readonly T[]) =>
    (value: unknown): value is T =>
      allowed.includes(value as T)
  const isStringList =
    (test: (value: string) => boolean = () => true) =>
    (value: unknown): value is string[] =>
      Array.isArray(value) &&
      value.every((item) => typeof item === "string" && test(item))

  const tags = read(
    "package.tags",
    pkg.tags,
    isStringList(),
    "liste de textes attendue"
  )
  if (tags && tags.length > MAX_TAGS) {
    warnings.push(
      `« package.tags » : seuls les ${MAX_TAGS} premiers tags sont conservés.`
    )
  }

  const scanned: ScannedManifest = {
    general: {
      packageName: read(
        "package.name",
        pkg.name,
        isStringMatching(isPackageNameFormatValid),
        "minuscules, chiffres et tirets uniquement"
      ),
      description: read(
        "package.description",
        pkg.description,
        isStringMatching((value) => value.length <= 120),
        "120 caractères maximum"
      ),
      type: read(
        "package.type",
        pkg.type,
        isOneOf(AGENT_TYPE_OPTIONS.map((option) => option.id)),
        `valeurs possibles : ${AGENT_TYPE_OPTIONS.map((option) => option.id).join(", ")}`
      ),
      category: read(
        "package.category",
        pkg.category,
        isOneOf(categories.map((category) => category.slug)),
        "catégorie inconnue du marketplace"
      ),
      tags: tags?.slice(0, MAX_TAGS),
      runtime: read(
        "run.runtime",
        run.runtime,
        isOneOf(RUNTIME_OPTIONS.map((option) => option.id)),
        `valeurs possibles : ${RUNTIME_OPTIONS.map((option) => option.id).join(", ")}`
      ),
    },
    manifest: {
      version: read(
        "package.version",
        pkg.version,
        isStringMatching(isSemverValid),
        "format semver attendu (ex. 1.0.0)"
      ),
      homepageUrl: read(
        "package.homepage",
        pkg.homepage,
        isStringMatching(isValidHttpUrl),
        "URL http(s) attendue"
      ),
      entrypoint: read(
        "run.entrypoint",
        run.entrypoint,
        isStringMatching((value) => value.trim().length > 0),
        "chemin de fichier attendu"
      ),
      args: read(
        "run.args",
        run.args,
        isStringList(),
        "liste de textes attendue"
      ),
    },
    permissions: {
      internetAccess: read(
        "permissions.network",
        perms.network,
        (value): value is boolean => typeof value === "boolean",
        "true ou false attendu"
      ),
      filesystemAccess: read(
        "permissions.filesystem",
        perms.filesystem,
        isOneOf(FILESYSTEM_ACCESS_OPTIONS.map((option) => option.id)),
        `valeurs possibles : ${FILESYSTEM_ACCESS_OPTIONS.map((option) => option.id).join(", ")}`
      ),
      envVars: read(
        "permissions.env",
        perms.env,
        isStringList(isEnvVarNameValid),
        "noms en MAJUSCULES_AVEC_UNDERSCORES attendus"
      ),
      terminalAccess: read(
        "permissions.terminal.access",
        terminal.access,
        isOneOf(TERMINAL_ACCESS_OPTIONS.map((option) => option.id)),
        `valeurs possibles : ${TERMINAL_ACCESS_OPTIONS.map((option) => option.id).join(", ")}`
      ),
      allowedCommands: read(
        "permissions.terminal.commands",
        terminal.commands,
        isStringList(isCommandNameValid),
        "noms de commandes sans espace attendus"
      ),
    },
    files: {
      readme:
        read(
          "package.readme",
          pkg.readme,
          isString,
          "chemin de fichier attendu"
        ) ?? "README.md",
      changelog:
        read(
          "package.changelog",
          pkg.changelog,
          isString,
          "chemin de fichier attendu"
        ) ?? "CHANGELOG.md",
    },
  }

  return { scanned, warnings }
}

// Pulls the section of a CHANGELOG.md that documents `version` — e.g. "## 1.2.0" or
// "## [1.2.0] - 2026-01-01" — up to the next heading of the same or higher level.
export function extractChangelogSection(
  changelog: string,
  version: string
): string {
  const lines = changelog.split("\n")
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const versionPattern = new RegExp(`(^|[^\\w.])v?${escaped}([^\\w.]|$)`)

  const start = lines.findIndex(
    (line) => /^#{1,6}\s/.test(line) && versionPattern.test(line)
  )
  if (start === -1) return ""

  const level = /^(#+)/.exec(lines[start])![1].length
  const end = lines.findIndex(
    (line, index) => index > start && new RegExp(`^#{1,${level}}\\s`).test(line)
  )
  return lines
    .slice(start, end === -1 ? undefined : end)
    .join("\n")
    .trim()
}
