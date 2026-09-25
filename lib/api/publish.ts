import { agents } from "@/lib/data/agents"
import {
  ManifestSyntaxError,
  parseManifestToml,
  type ScannedManifest,
} from "@/lib/publish/manifest-toml"
import type { PublishAgentPayload } from "@/lib/publish/types"

// Service layer for the publish wizard — mocked except for the manifest scan (see below). Every export here has the exact
// signature the real backend calls will have — swapping a body for a `fetch("/api/v1/...")`
// later never touches a caller. This is the only file that needs to change once
// the endpoints exist.
//
// To exercise the error states while testing, pass a package name containing
// "force-error" — every mock rejects deterministically on that.

const NETWORK_DELAY_MS = 700

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function mockRequest<T>(
  result: T,
  options?: { delayMs?: number; shouldFail?: boolean; errorMessage?: string }
): Promise<T> {
  await wait(options?.delayMs ?? NETWORK_DELAY_MS)
  if (options?.shouldFail) {
    throw new Error(
      options.errorMessage ?? "Une erreur réseau est survenue. Réessayez."
    )
  }
  return result
}

export type NameAvailability = { available: boolean; reason?: string }

const takenNames = new Set(agents.map((agent) => agent.name.toLowerCase()))

export async function checkNameAvailability(
  name: string
): Promise<NameAvailability> {
  const normalized = name.trim().toLowerCase()
  const taken = takenNames.has(normalized)

  return mockRequest(
    {
      available: !taken,
      reason: taken ? "Ce nom est déjà pris par un autre package." : undefined,
    },
    { delayMs: 500, shouldFail: normalized.includes("force-error") }
  )
}

// The manifest scan is real: it reads the repo straight from GitHub (public repos only,
// no auth). raw.githubusercontent.com serves CORS-enabled files without the REST API's
// 60 req/h limit; the API is only hit to tell "no manifest" apart from "no repo".
// Once the backend exists, this moves server-side behind the same signature.

export type ManifestScanResult =
  | {
      found: true
      scanned: ScannedManifest
      warnings: string[]
    }
  | { found: false }

function parseGithubRepo(repoUrl: string): { owner: string; repo: string } {
  const [owner, repo] = new URL(repoUrl.trim()).pathname
    .replace(/\.git\/?$/, "")
    .split("/")
    .filter(Boolean)
  return { owner, repo }
}

function normalizeRepoUrl(repoUrl: string): string {
  const { owner, repo } = parseGithubRepo(repoUrl)
  return `${owner}/${repo}`.toLowerCase()
}

// Manifest-provided paths are repo-relative; anything escaping the repo is refused.
function toRepoPath(path: string): string | null {
  const segments = path
    .replace(/^\.?\//, "")
    .split("/")
    .filter(Boolean)
  if (segments.length === 0 || segments.includes("..")) return null
  return segments.map(encodeURIComponent).join("/")
}

async function fetchRepoFile(
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  const safePath = toRepoPath(path)
  if (!safePath) return null
  // HEAD resolves to the repo's default branch, whatever its name.
  const response = await fetch(
    `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${safePath}`
  )
  if (response.status === 404) return null
  if (!response.ok)
    throw new Error("GitHub est injoignable pour l'instant. Réessayez.")
  return response.text()
}

export async function scanManifestFromRepo(
  repoUrl: string
): Promise<ManifestScanResult> {
  const { owner, repo } = parseGithubRepo(repoUrl)

  let manifestSource: string | null
  try {
    manifestSource = await fetchRepoFile(owner, repo, "manifest.toml")
  } catch {
    throw new Error("GitHub est injoignable pour l'instant. Réessayez.")
  }

  if (manifestSource === null) {
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`
    ).catch(() => null)
    if (repoResponse?.status === 404) {
      throw new Error(
        "Dépôt introuvable. Vérifiez le lien, ou rendez le dépôt public."
      )
    }
    return { found: false }
  }

  let parsed
  try {
    parsed = parseManifestToml(manifestSource)
  } catch (error) {
    throw new Error(
      error instanceof ManifestSyntaxError
        ? error.message
        : "manifest.toml illisible."
    )
  }
  const { scanned, warnings } = parsed

  // The README isn't copied: the marketplace reads it from the repo, so only its presence is checked.
  const readme = await fetchRepoFile(owner, repo, scanned.readmeFile).catch(
    () => ""
  )
  if (readme === null) {
    warnings.push(
      `${scanned.readmeFile} introuvable dans le dépôt : la fiche agent n'aura pas de README.`
    )
  }
  if (
    scanned.repository &&
    normalizeRepoUrl(scanned.repository) !== normalizeRepoUrl(repoUrl)
  ) {
    warnings.push(
      `« package.repository » pointe vers ${scanned.repository} : c'est le dépôt scanné qui sera enregistré.`
    )
  }

  return { found: true, scanned, warnings }
}

export type PublishResult =
  { ok: true; slug: string } | { ok: false; error: string }

export async function publishAgent(
  payload: PublishAgentPayload
): Promise<PublishResult> {
  try {
    return await mockRequest(
      { ok: true as const, slug: payload.manifest.package.name },
      {
        delayMs: 1400,
        shouldFail: payload.manifest.package.name
          .toLowerCase()
          .includes("force-error"),
      }
    )
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Échec de la publication.",
    }
  }
}
