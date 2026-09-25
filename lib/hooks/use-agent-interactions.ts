"use client"

import { useCallback, useEffect, useState } from "react"

import {
  type AgentInteractionState,
  followAgent,
  forkAgent,
  getAgentInteractions,
  starAgent,
  unfollowAgent,
  unforkAgent,
  unstarAgent,
} from "@/lib/api/agent-interactions"

const defaultState: AgentInteractionState = {
  starred: false,
  forked: false,
  following: false,
}

export function useAgentInteractions(slug: string) {
  const [state, setState] = useState<AgentInteractionState>(defaultState)

  useEffect(() => {
    let cancelled = false

    getAgentInteractions(slug).then((next) => {
      if (!cancelled) setState(next)
    })

    return () => {
      cancelled = true
    }
  }, [slug])

  const mutate = useCallback(
    (
      optimistic: (prev: AgentInteractionState) => AgentInteractionState,
      call: (slug: string) => Promise<AgentInteractionState>
    ) => {
      let rollbackTo = defaultState
      setState((prev) => {
        rollbackTo = prev
        return optimistic(prev)
      })
      call(slug)
        .then(setState)
        .catch(() => {
          setState(rollbackTo)
        })
    },
    [slug]
  )

  return {
    starred: state.starred,
    forked: state.forked,
    following: state.following,
    toggleStar: () =>
      mutate((prev) => ({ ...prev, starred: !prev.starred }), state.starred ? unstarAgent : starAgent),
    toggleFork: () =>
      mutate((prev) => ({ ...prev, forked: !prev.forked }), state.forked ? unforkAgent : forkAgent),
    toggleFollow: () =>
      mutate((prev) => ({ ...prev, following: !prev.following }), state.following ? unfollowAgent : followAgent),
  }
}
