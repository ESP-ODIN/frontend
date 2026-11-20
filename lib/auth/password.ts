/** Règles de mot de passe partagées par l'inscription et le changement de mot de passe. */

export type PasswordRule = { label: string; error: string; test: (value: string) => boolean }

export const PASSWORD_RULES: PasswordRule[] = [
  { label: "8+ characters", error: "at least 8 characters", test: (v) => v.length >= 8 },
  { label: "Uppercase", error: "an uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "Lowercase", error: "a lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "Number", error: "a number", test: (v) => /\d/.test(v) },
  { label: "Symbol", error: "a special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
]

/** Limite de bcrypt côté auth. */
export const PASSWORD_MAX_LENGTH = 72

/**
 * Score de 0 à 4 : les règles respectées, plus un bonus pour 12 caractères ou plus. Tant qu'une
 * règle manque, le mot de passe ne dépasse pas « Fair ».
 */
export function passwordStrength(value: string) {
  const passed = PASSWORD_RULES.filter((rule) => rule.test(value)).length
  const allPassed = passed === PASSWORD_RULES.length
  const score = allPassed ? (value.length >= 12 ? 4 : 3) : Math.min(2, Math.floor(passed / 2))
  return { score, passed }
}

/** Message d'erreur pour un nouveau mot de passe, ou null s'il respecte toutes les règles. */
export function validateNewPassword(value: string): string | null {
  if (value.length > PASSWORD_MAX_LENGTH) return `Use ${PASSWORD_MAX_LENGTH} characters at most.`
  const missing = PASSWORD_RULES.find((rule) => !rule.test(value))
  return missing ? `Your password needs ${missing.error}.` : null
}
