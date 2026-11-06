"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import {
  type AgentInteractionState,
  dislikeAgent,
  followAgent,
  getAgentInteractions,
  likeAgent,
  saveAgent,
  undislikeAgent,
  unfollowAgent,
  unlikeAgent,
  unsaveAgent,
} from "@/lib/api/agent-interactions"

const defaultState: AgentInteractionState = {
  liked: false,
  disliked: false,
  saved: false,
  following: false,
}

/**
 * Sans session, les interactions ne sont pas chargées et tout clic renvoie vers /login, avec
 * retour sur la page courante après connexion.
 */
export function useAgentInteractions(id: string, isLoggedIn: boolean) {
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = useState<AgentInteractionState>(defaultState)

  useEffect(() => {
    if (!isLoggedIn) return
    let cancelled = false

    getAgentInteractions(id).then((next) => {
      if (!cancelled) setState(next)
    })

    return () => {
      cancelled = true
    }
  }, [id, isLoggedIn])

  const mutate = useCallback(
    (
      optimistic: (prev: AgentInteractionState) => AgentInteractionState,
      call: (id: string) => Promise<AgentInteractionState>
    ) => {
      if (!isLoggedIn) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`)
        return
      }

      let rollbackTo = defaultState
      setState((prev) => {
        rollbackTo = prev
        return optimistic(prev)
      })
      call(id)
        .then(setState)
        .catch(() => {
          setState(rollbackTo)
        })
    },
    [id, isLoggedIn, router, pathname]
  )

  return {
    liked: state.liked,
    disliked: state.disliked,
    saved: state.saved,
    following: state.following,
    toggleLike: () =>
      mutate(
        (prev) => ({ ...prev, liked: !prev.liked, disliked: false }),
        state.liked ? unlikeAgent : likeAgent
      ),
    toggleDislike: () =>
      mutate(
        (prev) => ({ ...prev, disliked: !prev.disliked, liked: false }),
        state.disliked ? undislikeAgent : dislikeAgent
      ),
    toggleSave: () =>
      mutate((prev) => ({ ...prev, saved: !prev.saved }), state.saved ? unsaveAgent : saveAgent),
    toggleFollow: () =>
      mutate((prev) => ({ ...prev, following: !prev.following }), state.following ? unfollowAgent : followAgent),
  }
}
