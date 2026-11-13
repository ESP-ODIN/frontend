const AUTH_API_URL = process.env.AUTH_API_URL

type ApiUser = { ID: string; Email: string }
type ApiAuthResponse = { message: string; data?: { user: ApiUser; token: string } }

export type AuthResult = { ok: true } | { ok: false; error: string }
export type ApiAuthResult = { ok: true; token: string } | { ok: false; error: string }

export type LoginPayload = { email: string; password: string }

export type RegisterPayload = {
  username: string
  first_name: string
  last_name: string
  date_of_birth: string // YYYY-MM-DD
  email: string
  password: string
}

const ERROR_MESSAGES: Record<number, string> = {
  400: "Invalid email or password format.",
  401: "Incorrect email or password.",
  409: "An account already exists with this email.",
  429: "Too many attempts, please try again later.",
}

async function postAuth(path: "login" | "register", payload: LoginPayload | RegisterPayload): Promise<ApiAuthResult> {
  try {
    const response = await fetch(`${AUTH_API_URL}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorMessage = ERROR_MESSAGES[response.status] || "An unexpected error occurred."
      return { ok: false, error: errorMessage }
    }

    const data: ApiAuthResponse = await response.json()
    if (data.data) {
      return { ok: true, token: data.data.token }
    } else {
      return { ok: false, error: data.message }
    }
  } catch {
    return { ok: false, error: "Network error. Please try again later." }
  }
}

export async function login(payload: LoginPayload): Promise<ApiAuthResult> {
  return postAuth("login", payload)
}

export async function register(payload: RegisterPayload): Promise<ApiAuthResult> {
  return postAuth("register", payload)
}


export type AvailabilityField = "email" | "username"

type ApiAvailabilityResponse = {
  data?: { email_available?: boolean; username_available?: boolean }
}

/** Indique si l'email ou le username est encore libre ; `null` si la vérification a échoué. */
export async function checkAvailability(field: AvailabilityField, value: string): Promise<boolean | null> {
  try {
    const response = await fetch(`${AUTH_API_URL}/availability?${new URLSearchParams({ [field]: value })}`, {
      cache: "no-store",
    })
    if (!response.ok) return null

    const { data }: ApiAvailabilityResponse = await response.json()
    const available = field === "email" ? data?.email_available : data?.username_available
    return available ?? null
  } catch {
    return null
  }
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  console.info("[auth] request password reset", email)
  return { ok: true }
}

export type ResetPasswordPayload = { token: string; password: string }

export async function resetPassword(payload: ResetPasswordPayload): Promise<AuthResult> {
  console.info("[auth] reset password", payload.token)
  return { ok: true }
}

export type OAuthProvider = "google" | "github"

export async function signInWithOAuth(provider: OAuthProvider): Promise<void> {
  console.info(`[auth] oauth redirect -> ${provider}`)
}
