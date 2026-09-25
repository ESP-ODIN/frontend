import { parse, TomlError } from "smol-toml"

import { categories } from "@/lib/data/categories"
import {
  AGENT_TYPE_OPTIONS,
  DEFAULT_README_FILE,
  FILESYSTEM_ACCESS_OPTIONS,
  MAX_TAGS,
  RUNTIME_OPTIONS,
  TERMINAL_ACCESS_OPTIONS,
} from "./constants"
import type {
  Manifest,
  PackageSection,
  PermissionsSection,
  PublishFormData,
  RunSection,
  RuntimeId,
  TerminalSection,
} from "./types"
import {
  isCommandNameValid,
  isEnvVarNameValid,
  isGithubRepoUrlValid,
  isPackageNameFormatValid,
  isSemverValid,
} from "./validation"

// Reads a manifest.toml into the form's shape (and back, see buildManifest). Every key is optional: a missing key
// leaves the field empty, an invalid one is skipped and reported as a warning, so a
// half-valid manifest still prefills everything it can.
//
// Expected format:
//   [package]  name, version, description, type, category, tags, repository,
//              readme (path of the README in the repo), changelog (Markdown notes of this version)
//   [run]      runtime, entrypoint, args
//   [permissions]           network, filesystem, env
//   [permissions.terminal]  access, commands

export type ScannedManifest = {
  package: Partial<PackageSection>
  run: Partial<RunSection>
  permissions: Partial<Omit<PermissionsSection, "terminal">>
  terminal: Partial<TerminalSection>
  /** GitHub URL declared in the file — the scanned repo stays the source of truth. */
  repository?: string
  /** Repo-relative path of the README. */
  readmeFile: string
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
    package: {
      name: read(
        "package.name",
        pkg.name,
        isStringMatching(isPackageNameFormatValid),
        "minuscules, chiffres et tirets uniquement"
      ),
      version: read(
        "package.version",
        pkg.version,
        isStringMatching(isSemverValid),
        "format semver attendu (ex. 1.0.0)"
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
      changelog: read(
        "package.changelog",
        pkg.changelog,
        isString,
        "texte Markdown attendu"
      )?.trim(),
    },
    run: {
      runtime: read(
        "run.runtime",
        run.runtime,
        isOneOf(RUNTIME_OPTIONS.map((option) => option.id)),
        `valeurs possibles : ${RUNTIME_OPTIONS.map((option) => option.id).join(", ")}`
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
      network: read(
        "permissions.network",
        perms.network,
        (value): value is boolean => typeof value === "boolean",
        "true ou false attendu"
      ),
      filesystem: read(
        "permissions.filesystem",
        perms.filesystem,
        isOneOf(FILESYSTEM_ACCESS_OPTIONS.map((option) => option.id)),
        `valeurs possibles : ${FILESYSTEM_ACCESS_OPTIONS.map((option) => option.id).join(", ")}`
      ),
      env: read(
        "permissions.env",
        perms.env,
        isStringList(isEnvVarNameValid),
        "noms en MAJUSCULES_AVEC_UNDERSCORES attendus"
      ),
    },
    terminal: {
      access: read(
        "permissions.terminal.access",
        terminal.access,
        isOneOf(TERMINAL_ACCESS_OPTIONS.map((option) => option.id)),
        `valeurs possibles : ${TERMINAL_ACCESS_OPTIONS.map((option) => option.id).join(", ")}`
      ),
      commands: read(
        "permissions.terminal.commands",
        terminal.commands,
        isStringList(isCommandNameValid),
        "noms de commandes sans espace attendus"
      ),
    },
    repository: read(
      "package.repository",
      pkg.repository,
      isStringMatching(isGithubRepoUrlValid),
      "URL https://github.com/org/repo attendue"
    ),
    readmeFile:
      read(
        "package.readme",
        pkg.readme,
        isString,
        "chemin de fichier attendu"
      ) ?? DEFAULT_README_FILE,
  }

  return { scanned, warnings }
}

// The form already mirrors the TOML tables: this only drops what the file doesn't carry
// (commands when the terminal isn't restricted) and pulls the repo
// URL and README path from the source step.
// Assumes a valid form — the recap is only reachable once every step is.
export function buildManifest(data: PublishFormData): Manifest {
  const { package: pkg, run, permissions, source } = data
  const { access, commands } = permissions.terminal

  return {
    package: {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      type: pkg.type,
      category: pkg.category,
      tags: pkg.tags,
      repository: source.repoUrl.trim(),
      readme: source.readmeFile,
      changelog: pkg.changelog.trim(),
    },
    run: {
      runtime: run.runtime as RuntimeId,
      entrypoint: run.entrypoint.trim(),
      args: run.args,
    },
    permissions: {
      network: permissions.network,
      filesystem: permissions.filesystem,
      env: permissions.env,
      terminal: {
        access,
        ...(access === "restricted" && { commands }),
      },
    },
  }
}

type TomlValue = string | boolean | string[]

// JSON string escapes are valid TOML basic-string escapes; TOML additionally forbids a raw DEL.
function tomlString(value: string): string {
  return JSON.stringify(value).replace(/\x7f/g, "\\u007f")
}

// Multi-line basic string for Markdown: every `"` and `\\` is escaped so no `"""` can close
// it early, and control characters other than tab / newline are escaped as TOML requires.
// The newline after the opening quotes is dropped by TOML parsers; the one before the
// closing quotes is kept, hence the trim() when reading and building the changelog.
function tomlMultilineString(value: string): string {
  const escaped = value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(
      /[\x00-\x08\x0b-\x1f\x7f]/g,
      (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`
    )
  return `"""\n${escaped}\n"""`
}

function tomlValue(value: TomlValue): string {
  if (typeof value === "boolean") return String(value)
  if (Array.isArray(value)) return `[${value.map(tomlString).join(", ")}]`
  return value.includes("\n") ? tomlMultilineString(value) : tomlString(value)
}

function tomlTable(
  name: string,
  entries: [key: string, value: TomlValue | undefined][]
): string {
  const present = entries.filter(
    (entry): entry is [string, TomlValue] => entry[1] !== undefined
  )
  const width = Math.max(...present.map(([key]) => key.length))
  return [
    `[${name}]`,
    ...present.map(
      ([key, value]) => `${key.padEnd(width)} = ${tomlValue(value)}`
    ),
  ].join("\n")
}

// Hand-written rather than smol-toml's stringify to keep the conventional key order
// and the aligned `=` of a hand-edited manifest.toml.
export function stringifyManifestToml(manifest: Manifest): string {
  const { package: pkg, run, permissions } = manifest

  return (
    [
      tomlTable("package", [
        ["name", pkg.name],
        ["version", pkg.version],
        ["description", pkg.description],
        ["type", pkg.type],
        ["category", pkg.category],
        ["tags", pkg.tags],
        ["repository", pkg.repository],
        ["readme", pkg.readme],
        ["changelog", pkg.changelog],
      ]),
      tomlTable("run", [
        ["runtime", run.runtime],
        ["entrypoint", run.entrypoint],
        ["args", run.args],
      ]),
      tomlTable("permissions", [
        ["network", permissions.network],
        ["filesystem", permissions.filesystem],
        ["env", permissions.env],
      ]),
      tomlTable("permissions.terminal", [
        ["access", permissions.terminal.access],
        ["commands", permissions.terminal.commands],
      ]),
    ].join("\n\n") + "\n"
  )
}
