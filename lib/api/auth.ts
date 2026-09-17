export type RegisterPayload = {
  name: string
  email: string
  password: string
}

export type AuthResult = { ok: true } | { ok: false; error: string }

export async function registerWithEmail(payload: RegisterPayload): Promise<AuthResult> {
  console.info("[auth] register", payload.email)
  return { ok: true }
}

export type OAuthProvider = "google" | "github"

export async function signInWithOAuth(provider: OAuthProvider): Promise<void> {
  console.info(`[auth] oauth redirect -> ${provider}`)
}
