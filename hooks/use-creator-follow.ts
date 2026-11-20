"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { followCreator, isFollowingCreator, unfollowCreator } from "@/lib/api/creator-follows"

/**
 * Suivi d'un créateur. Sans session, rien n'est chargé et le clic renvoie vers /login, avec retour
 * sur la page courante après connexion.
 */
export function useCreatorFollow(creatorId: string, isLoggedIn: boolean) {
  const router = useRouter()
  const pathname = usePathname()
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) return
    let cancelled = false
    isFollowingCreator(creatorId).then((value) => {
      if (!cancelled) setFollowing(value)
    })
    return () => {
      cancelled = true
    }
  }, [creatorId, isLoggedIn])

  const toggle = useCallback(() => {
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`)
      return
    }
    const previous = following
    setFollowing(!previous)
    ;(previous ? unfollowCreator : followCreator)(creatorId)
      .then(setFollowing)
      .catch(() => setFollowing(previous))
  }, [creatorId, following, isLoggedIn, pathname, router])

  return { following, toggle }
}
