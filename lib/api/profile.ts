/**
 * Compte de l'utilisateur connecté : lecture (types partagés) et modifications.
 *
 * Les modifications sont mockées en attendant l'API auth : le profil est gardé dans le localStorage
 * et le mot de passe / la suppression ne font que valider. Pour brancher l'API, il suffit de
 * remplacer le corps de ces fonctions (idéalement par des server actions, le token de session étant
 * en cookie httpOnly). Les composants n'ont rien à changer.
 */

export type CurrentUser = {
  id: string
  email?: string
  username?: string
  firstName?: string
  lastName?: string
  bio?: string
  /** ISO 8601 */
  createdAt?: string
  /** "api" : données de GET /me ; "jwt" : seulement l'id et l'email du token. */
  source: "api" | "jwt"
}

export type AccountDisplay = {
  /** Nom complet, sinon @pseudo, sinon email. */
  title: string
  /** @pseudo sous le nom quand on a les deux. */
  handle?: string
  /** false tant que seules les infos du JWT sont connues (DevMark). */
  complete: boolean
}

export function accountDisplay(user: CurrentUser): AccountDisplay {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ")
  const handle = user.username ? `@${user.username}` : undefined
  return {
    title: fullName || handle || user.email || "My account",
    handle: fullName ? handle : undefined,
    complete: user.source === "api",
  }
}

export type ProfileValues = { firstName: string; lastName: string; username: string; bio: string }

export type MutationResult = { ok: true } | { ok: false; error: string; field?: string }

export const PROFILE_NOTES = {
  identity: "first name, last name and username: no GET /me route in the auth API, only the JWT (id + email) is read",
  profile: "profile update: no PATCH /me route in the auth API, values are kept in this browser's localStorage",
  email: "email change: no route in the auth API",
  password: "password change: no PUT /me/password route in the auth API, the form only validates locally",
  delete: "account deletion: no DELETE /me route in the auth API, nothing is deleted",
}

const PROFILE_STORAGE_KEY = "odin:profile-settings:v1"
const EMPTY_PROFILE: ProfileValues = { firstName: "", lastName: "", username: "", bio: "" }

/** Valeurs du formulaire de profil : celles de l'API si elle les a données, sinon le mock local. */
export async function getProfileValues(user: Pick<CurrentUser, "firstName" | "lastName" | "username" | "bio" | "source">): Promise<ProfileValues> {
  if (user.source === "api") {
    return {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      username: user.username ?? "",
      bio: user.bio ?? "",
    }
  }
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY)
    return raw ? { ...EMPTY_PROFILE, ...JSON.parse(raw) } : EMPTY_PROFILE
  } catch {
    return EMPTY_PROFILE
  }
}

/** À brancher sur PATCH /me { first_name, last_name, username, bio } (409 si le pseudo est pris). */
export async function updateProfile(values: ProfileValues): Promise<MutationResult> {
  try {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(values))
  } catch {}
  return { ok: true }
}

/** À brancher sur PUT /me/password { current_password, new_password } (401 si l'actuel est faux). */
export async function changePassword(_current: string, _next: string): Promise<MutationResult> {
  return { ok: true }
}

/** À brancher sur DELETE /me (puis déconnexion). */
export async function deleteAccount(): Promise<MutationResult> {
  return { ok: true }
}
