"use server"

import {
  checkNameAvailability,
  fetchReadmeMarkdown,
  publishAgent,
  type NameAvailability,
  type PublishResult,
} from "@/lib/api/publish"
import { getSessionAccount } from "@/lib/auth/session"
import type { PublishAgentPayload } from "@/lib/publish/types"

export async function checkNameAvailabilityAction(
  name: string
): Promise<NameAvailability> {
  return checkNameAvailability(name)
}

/**
 * Le créateur est le compte de la session (claim `id` du JWT). L'API marketplace n'a pas
 * d'authentification et fait confiance au `creator_id` du body.
 */
export async function publishAgentAction(
  payload: PublishAgentPayload
): Promise<PublishResult> {
  const account = await getSessionAccount()
  if (!account) {
    return {
      ok: false,
      error: "Your session has expired. Please sign in again.",
    }
  }

  const { repository, readme } = payload.manifest.package
  const readmeMarkdown = await fetchReadmeMarkdown(repository, readme)

  return publishAgent(payload, account.id, readmeMarkdown)
}
