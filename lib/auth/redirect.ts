export const DEFAULT_AUTH_REDIRECT = "/marketplace"

/**
 * Valide le paramètre ?next= : seulement un chemin interne, pour éviter qu'un lien piégé ne
 * renvoie l'utilisateur vers un site externe après connexion ("//evil.com" est refusé).
 */
export function safeRedirectPath(next: string | string[] | null | undefined): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT
  }
  return next
}
