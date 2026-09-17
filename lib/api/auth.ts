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

export type LoginPayload = {
  email: string
  password: string
}

export async function loginWithEmail(payload: LoginPayload): Promise<AuthResult> {
  console.info("[auth] login", payload.email)
  return { ok: true }
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  console.info("[auth] request password reset", email)
  return { ok: true }
}

export type ResetPasswordPayload = {
  token: string
  password: string
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<AuthResult> {
  console.info("[auth] reset password", payload.token)
  return { ok: true }
}

export type OAuthProvider = "google" | "github"

export async function signInWithOAuth(provider: OAuthProvider): Promise<void> {
  console.info(`[auth] oauth redirect -> ${provider}`)
}
