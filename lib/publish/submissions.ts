import type { AgentType } from "@/lib/agents/types"

/**
 * Publications envoyées depuis /publish, en attendant que l'API expose un statut de revue.
 * Mock : stockées dans le localStorage du navigateur, comme les likes et les follows.
 */
export type SubmissionStatus = "in_review" | "published" | "rejected"

export type Submission = {
  id: string
  name: string
  version: string
  type: AgentType
  category: string
  runtime: string
  /** ISO 8601 */
  submittedAt: string
  status: SubmissionStatus
}

export const SUBMISSIONS_MOCK_NOTE =
  "review status: the API has no publication status yet, submissions are kept in this browser's localStorage"

const STORAGE_KEY = "odin:publish-submissions:v1"

function read(): Submission[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Submission[]) : []
  } catch {
    return []
  }
}

function write(submissions: Submission[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions))
  } catch {}
}

/** Les plus récentes d'abord. */
export function listSubmissions(): Submission[] {
  return read().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
}

/** Enregistre une publication ; une nouvelle version du même nom remplace l'ancienne. */
export function addSubmission(input: Omit<Submission, "id" | "submittedAt" | "status">): Submission {
  const submission: Submission = {
    ...input,
    id: `${input.name}@${input.version}`,
    submittedAt: new Date().toISOString(),
    status: "in_review",
  }
  write([submission, ...read().filter((item) => item.name.toLowerCase() !== input.name.toLowerCase())])
  return submission
}

export function withdrawSubmission(id: string) {
  write(read().filter((item) => item.id !== id))
}
