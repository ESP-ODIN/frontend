"use client"

import { useCallback, useEffect, useState } from "react"

type AgentInteractionState = {
  starred: boolean
  forked: boolean
  following: boolean
}

const STORAGE_KEY = "odin:agent-interactions"

const defaultState: AgentInteractionState = {
  starred: false,
  forked: false,
  following: false,
}

function readStore(): Record<string, AgentInteractionState> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, AgentInteractionState>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // localStorage unavailable (private browsing, quota, ...) — state stays in-memory only.
  }
}

export function useAgentInteractions(slug: string) {
  const [state, setState] = useState<AgentInteractionState>(defaultState)

  useEffect(() => {
    setState(readStore()[slug] ?? defaultState)
  }, [slug])

  const toggle = useCallback(
    (key: keyof AgentInteractionState) => {
      setState((prev) => {
        const next = { ...prev, [key]: !prev[key] }
        const store = readStore()
        store[slug] = next
        writeStore(store)
        return next
      })
    },
    [slug]
  )

  return {
    starred: state.starred,
    forked: state.forked,
    following: state.following,
    toggleStar: () => toggle("starred"),
    toggleFork: () => toggle("forked"),
    toggleFollow: () => toggle("following"),
  }
}
