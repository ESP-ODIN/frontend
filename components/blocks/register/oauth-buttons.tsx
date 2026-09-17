"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { signInWithOAuth, type OAuthProvider } from "@/lib/api/auth"
import { GithubIcon, GoogleIcon } from "@/components/blocks/register/oauth-icons"

export function OAuthButtons() {
  const [pending, setPending] = useState<OAuthProvider | null>(null)

  async function handleOAuth(provider: OAuthProvider) {
    setPending(provider)
    try {
      await signInWithOAuth(provider)
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button
        type="button"
        variant="outline"
        className="flex-1 rounded-lg"
        disabled={pending !== null}
        onClick={() => handleOAuth("google")}
      >
        <GoogleIcon />
        Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="flex-1 rounded-lg"
        disabled={pending !== null}
        onClick={() => handleOAuth("github")}
      >
        <GithubIcon />
        GitHub
      </Button>
    </div>
  )
}
