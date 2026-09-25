import {
  AGENT_TYPE_OPTIONS,
  DEFAULT_FORM_DATA,
  FILESYSTEM_ACCESS_OPTIONS,
  MANIFEST_SOURCE_OPTIONS,
  MAX_TAGS,
  RUNTIME_OPTIONS,
  TERMINAL_ACCESS_OPTIONS,
  WIZARD_STEPS,
} from "./constants"
import type { PublishFormData } from "./types"

export const DRAFT_PARAM = "draft"

export type PublishDraft = { data: PublishFormData; step: number }

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(encoded: string): string {
  const binary = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"))
  return new TextDecoder().decode(
    Uint8Array.from(binary, (char) => char.charCodeAt(0))
  )
}

export function serializeDraft(draft: PublishDraft): string {
  return toBase64Url(JSON.stringify({ d: draft.data, s: draft.step }))
}

function str(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback
}

function oneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T
): T {
  return allowed.includes(value as T) ? (value as T) : fallback
}

function strList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : []
}

function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {}
}

function sanitizeFormData(raw: unknown): PublishFormData {
  const { source: s, package: p, run: r, permissions: perm } = DEFAULT_FORM_DATA
  const source = record(record(raw).source)
  const pkg = record(record(raw).package)
  const run = record(record(raw).run)
  const permissions = record(record(raw).permissions)
  const terminal = record(permissions.terminal)

  return {
    source: {
      kind: oneOf(
        source.kind,
        ["", ...MANIFEST_SOURCE_OPTIONS.map((o) => o.id)],
        s.kind
      ),
      repoUrl: str(source.repoUrl, s.repoUrl),
      scannedRepoUrl: str(source.scannedRepoUrl, s.scannedRepoUrl),
      readmeFile: str(source.readmeFile, s.readmeFile),
    },
    package: {
      name: str(pkg.name, p.name),
      version: str(pkg.version, p.version),
      description: str(pkg.description, p.description),
      type: oneOf(
        pkg.type,
        AGENT_TYPE_OPTIONS.map((o) => o.id),
        p.type
      ),
      category: str(pkg.category, p.category),
      tags: strList(pkg.tags).slice(0, MAX_TAGS),
      changelog: str(pkg.changelog, p.changelog),
    },
    run: {
      runtime: oneOf(
        run.runtime,
        ["", ...RUNTIME_OPTIONS.map((o) => o.id)],
        r.runtime
      ),
      entrypoint: str(run.entrypoint, r.entrypoint),
      args: strList(run.args),
    },
    permissions: {
      network:
        typeof permissions.network === "boolean"
          ? permissions.network
          : perm.network,
      filesystem: oneOf(
        permissions.filesystem,
        FILESYSTEM_ACCESS_OPTIONS.map((o) => o.id),
        perm.filesystem
      ),
      env: strList(permissions.env),
      terminal: {
        access: oneOf(
          terminal.access,
          TERMINAL_ACCESS_OPTIONS.map((o) => o.id),
          perm.terminal.access
        ),
        commands: strList(terminal.commands),
      },
    },
  }
}

export function parseDraft(
  encoded: string | undefined | null
): PublishDraft | null {
  if (!encoded) return null
  try {
    const raw = record(JSON.parse(fromBase64Url(encoded)))
    const step =
      typeof raw.s === "number" && Number.isInteger(raw.s) ? raw.s : 0
    return {
      data: sanitizeFormData(raw.d),
      step: Math.min(Math.max(step, 0), WIZARD_STEPS.length - 1),
    }
  } catch {
    return null
  }
}
