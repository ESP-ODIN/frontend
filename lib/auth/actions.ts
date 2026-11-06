"use server"

import {
  login,
  register,
  type AuthResult,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/api/auth"
import { setSession } from "@/lib/auth/session"

export async function loginAction(payload: LoginPayload): Promise<AuthResult> {
  const result = await login(payload)
  if (!result.ok) return result

  await setSession(result.token)
  return { ok: true }
}

export async function registerAction(payload: RegisterPayload): Promise<AuthResult> {
  const result = await register(payload)
  if (!result.ok) return result

  await setSession(result.token)
  return { ok: true }
}
