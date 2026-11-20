import { DEFAULT_README_FILE } from "@/lib/publish/constants"
import type { PublishAgentPayload, ScannedManifest } from "@/lib/publish/types"

const MARKETPLACE_API_URL = process.env.MARKETPLACE_API_URL

const NETWORK_DELAY_MS = 700
const README_FETCH_TIMEOUT_MS = 5000

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
      options.errorMessage ?? "A network error occurred. Please try again."
    )
  }
  return result
}

export type NameAvailability = { available: boolean; reason?: string }


export async function checkNameAvailability(
  name: string
): Promise<NameAvailability> {
  const res = await fetch(`${MARKETPLACE_API_URL}/catalog/agents`, {
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Marketplace API responded with ${res.status}`)

  const { data } = (await res.json()) as { data: { name: string }[] }
  const normalized = name.trim().toLowerCase()
  const taken = data.some((agent) => agent.name.toLowerCase() === normalized)

  return {
    available: !taken,
    reason: taken
      ? "This name is already taken by another package."
      : undefined,
  }
}

export type ManifestScanResult =
  | {
      found: true
      scanned: ScannedManifest
      warnings: string[]
    }
  | { found: false }

export async function scanManifestFromRepo(
  repoUrl: string
): Promise<ManifestScanResult> {
  const normalized = repoUrl.trim().toLowerCase()
  if (normalized.includes("no-manifest")) {
    return mockRequest({ found: false })
  }

  return mockRequest<ManifestScanResult>(
    {
      found: true,
      scanned: {
        package: {},
        run: {},
        permissions: {},
        terminal: {},
        readmeFile: DEFAULT_README_FILE,
      },
      warnings: [],
    },
    { shouldFail: normalized.includes("force-error") }
  )
}

/**
 * Contenu du README sur la branche par défaut du repo GitHub public, via raw.githubusercontent.com.
 * `null` si le repo est privé, le fichier absent ou GitHub injoignable : la publication continue
 * sans README.
 */
export async function fetchReadmeMarkdown(
  repoUrl: string,
  readmeFile: string
): Promise<string | null> {
  const match = repoUrl
    .trim()
    .match(/^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/)
  if (!match) return null

  const [, owner, repo] = match
  const path = readmeFile.split("/").map(encodeURIComponent).join("/")
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(README_FETCH_TIMEOUT_MS),
      }
    )
    return res.ok ? await res.text() : null
  } catch {
    return null
  }
}

/** Body de POST /catalog/agents (dto.CreateAgentRequest côté marketplace). */
type CreateAgentRequest = {
  name: string
  creator_id: string
  category: string
  agent_type: string
  runtime: string
  description?: string
  readme_markdown?: string
}

type ApiError = { error?: string; details?: string }

export type PublishResult =
  { ok: true; id: string; name: string } | { ok: false; error: string }

/**
 * POST /catalog/agents. L'API ne prend que l'identité de l'agent : version, tags, changelog,
 * repository, [run] et [permissions] du manifest ne sont pas envoyés (DevMarks dans le formulaire).
 */
export async function publishAgent(
  payload: PublishAgentPayload,
  creatorId: string,
  readmeMarkdown: string | null
): Promise<PublishResult> {
  const { package: pkg, run } = payload.manifest
  const body: CreateAgentRequest = {
    name: pkg.name,
    creator_id: creatorId,
    category: pkg.category,
    agent_type: pkg.type,
    runtime: run.runtime,
    description: pkg.description.trim() || undefined,
    readme_markdown: readmeMarkdown ?? undefined,
  }

  try {
    const res = await fetch(`${MARKETPLACE_API_URL}/catalog/agents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    if (res.ok) {
      const { data } = (await res.json()) as {
        data: { id: string; name: string }
      }
      return { ok: true, id: data.id, name: data.name }
    }

    const error = (await res.json().catch(() => ({}))) as ApiError
    if (res.status === 400) {
      console.error("[publish] marketplace rejected the payload", error)
      return {
        ok: false,
        error:
          "The marketplace rejected some fields. Check the form and try again.",
      }
    }
    console.error(`[publish] marketplace responded with ${res.status}`, error)
    return {
      ok: false,
      error:
        "Publication failed on the marketplace side. Please try again later.",
    }
  } catch {
    return { ok: false, error: "Network error. Please try again later." }
  }
}
