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

export function useAgentInteractions(id: string) {
  const [state, setState] = useState<AgentInteractionState>(defaultState)

  useEffect(() => {
    let cancelled = false

    getAgentInteractions(id).then((next) => {
      if (!cancelled) setState(next)
    })

    return () => {
      cancelled = true
    }
  }, [id])

  const mutate = useCallback(
    (
      optimistic: (prev: AgentInteractionState) => AgentInteractionState,
      call: (id: string) => Promise<AgentInteractionState>
    ) => {
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
    [id]
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
