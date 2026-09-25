import type { Manifest, PublishFormData, RuntimeId } from "./types"

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

function tomlString(value: string): string {
  return JSON.stringify(value).replace(/\x7f/g, "\\u007f")
}

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
