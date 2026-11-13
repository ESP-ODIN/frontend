"use server"

import { redirect } from "next/navigation"

import {
  checkAvailability,
  login,
  register,
  type AuthResult,
  type AvailabilityField,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/api/auth"
import { clearSession, setSession } from "@/lib/auth/session"

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

export async function logoutAction(): Promise<void> {
  await clearSession()
  redirect("/")
}

export async function checkAvailabilityAction(field: AvailabilityField, value: string): Promise<boolean | null> {
  return checkAvailability(field, value)
}
