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

// The whole wizard state lives in `?draft=` so a refresh (or a shared link) restores it.
// The value is base64url-encoded JSON: opaque, but URL-safe and UTF-8 friendly.
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

// The URL is user-editable, so every field is checked against its expected type
// and falls back to the default — a tampered or outdated draft never crashes the wizard.
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
  const { general: g, manifest: m, permissions: p } = DEFAULT_FORM_DATA
  const general = record(record(raw).general)
  const manifest = record(record(raw).manifest)
  const permissions = record(record(raw).permissions)

  return {
    general: {
      packageName: str(general.packageName, g.packageName),
      description: str(general.description, g.description),
      type: oneOf(
        general.type,
        AGENT_TYPE_OPTIONS.map((o) => o.id),
        g.type
      ),
      tags: strList(general.tags).slice(0, MAX_TAGS),
      runtime: oneOf(
        general.runtime,
        ["", ...RUNTIME_OPTIONS.map((o) => o.id)],
        g.runtime
      ),
      category: str(general.category, g.category),
    },
    manifest: {
      source: oneOf(
        manifest.source,
        ["", ...MANIFEST_SOURCE_OPTIONS.map((o) => o.id)],
        m.source
      ),
      repoUrl: str(manifest.repoUrl, m.repoUrl),
      scannedRepoUrl: str(manifest.scannedRepoUrl, m.scannedRepoUrl),
      version: str(manifest.version, m.version),
      entrypoint: str(manifest.entrypoint, m.entrypoint),
      args: strList(manifest.args),
      changelog: str(manifest.changelog, m.changelog),
      readme: str(manifest.readme, m.readme),
      homepageUrl: str(manifest.homepageUrl, m.homepageUrl),
    },
    permissions: {
      internetAccess:
        typeof permissions.internetAccess === "boolean"
          ? permissions.internetAccess
          : p.internetAccess,
      filesystemAccess: oneOf(
        permissions.filesystemAccess,
        FILESYSTEM_ACCESS_OPTIONS.map((o) => o.id),
        p.filesystemAccess
      ),
      terminalAccess: oneOf(
        permissions.terminalAccess,
        TERMINAL_ACCESS_OPTIONS.map((o) => o.id),
        p.terminalAccess
      ),
      allowedCommands: strList(permissions.allowedCommands),
      envVars: strList(permissions.envVars),
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
