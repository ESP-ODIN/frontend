import { agents } from "@/lib/data/agents"
import { DEFAULT_README_FILE } from "@/lib/publish/constants"
import type { PublishAgentPayload, ScannedManifest } from "@/lib/publish/types"

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
