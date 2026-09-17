"use client"

import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { requestPasswordReset } from "@/lib/api/auth"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    setIsSubmitting(true)
    const result = await requestPasswordReset(email)
    setIsSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Si un compte existe pour <span className="font-medium text-foreground">{email}</span>, vous
        recevrez un email avec un lien de réinitialisation.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="john.abruzzi@exemple.com"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="mt-2 rounded-lg" disabled={isSubmitting}>
        {isSubmitting ? "Envoi..." : "Envoyer le lien de réinitialisation"}
      </Button>
    </form>
  )
}
