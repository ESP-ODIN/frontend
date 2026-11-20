import type { ApiLike, ApiPost } from "@/lib/social/types"

/**
 * Client de l'API social, côté serveur uniquement : toutes les routes demandent le JWT de session
 * (cookie httpOnly) en Bearer. Les réponses ne sont pas enveloppées dans `data` : un tableau ou un
 * objet brut, et `{ error }` en cas d'échec.
 */
const SOCIAL_API_URL = process.env.SOCIAL_API_URL

const TIMEOUT_MS = 4000

export class SocialApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
  }
}

/** L'API social n'est pas configurée ou ne répond pas (le feed passe alors en démo). */
export class SocialUnavailableError extends Error {}

async function request<T>(
  path: string,
  token: string,
  init?: { method?: string; body?: unknown }
): Promise<T> {
  if (!SOCIAL_API_URL)
    throw new SocialUnavailableError("SOCIAL_API_URL is not set")

  let res: Response
  try {
    res = await fetch(`${SOCIAL_API_URL}${path}`, {
      method: init?.method ?? "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
      },
      body: init?.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch {
    throw new SocialUnavailableError(
      `social API unreachable at ${SOCIAL_API_URL}`
    )
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      error?: string
    } | null
    throw new SocialApiError(body?.error ?? res.statusText, res.status)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

/** GET /users/{userId}/posts : posts d'un utilisateur, du plus récent au plus ancien. */
export function getUserPosts(
  userId: string,
  token: string
): Promise<ApiPost[]> {
  return request(`/users/${encodeURIComponent(userId)}/posts`, token)
}

/** GET /posts/{postId}/likes */
export function getPostLikes(
  postId: string,
  token: string
): Promise<ApiLike[]> {
  return request(`/posts/${encodeURIComponent(postId)}/likes`, token)
}

/** POST /posts : l'auteur est le compte du token. */
export function createPost(
  input: { content: string; media_url?: string },
  token: string
): Promise<ApiPost> {
  return request("/posts", token, { method: "POST", body: input })
}

/** DELETE /posts/{id} : seulement par son auteur. */
export function deletePost(postId: string, token: string): Promise<void> {
  return request(`/posts/${encodeURIComponent(postId)}`, token, {
    method: "DELETE",
  })
}

/** POST /posts/{postId}/likes (409 si déjà liké). */
export function likePost(postId: string, token: string): Promise<ApiLike> {
  return request(`/posts/${encodeURIComponent(postId)}/likes`, token, {
    method: "POST",
  })
}

/** DELETE /posts/{postId}/likes (404 si pas liké). */
export function unlikePost(postId: string, token: string): Promise<void> {
  return request(`/posts/${encodeURIComponent(postId)}/likes`, token, {
    method: "DELETE",
  })
}
