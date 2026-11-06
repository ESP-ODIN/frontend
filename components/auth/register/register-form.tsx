"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { registerAction } from "@/lib/auth/actions"

/** Date du jour au format YYYY-MM-DD, pour empêcher une date de naissance dans le futur. */
function today() {
  return new Date().toISOString().slice(0, 10)
}

export function RegisterForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [firstName, setFirstName] = useState("")
  const [name, setName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)
    const result = await registerAction({
      username,
      name,
      first_name: firstName,
      birth_date: birthDate,
      email,
      password,
    })
    setIsSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    router.push("/marketplace")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="username"
            className="text-sm font-medium text-foreground"
          >
            Username
          </label>
          <Input
            id="username"
            name="username"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="jabruzzi"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="birth-date"
            className="text-sm font-medium text-foreground"
          >
            Birth date
          </label>
          <Input
            id="birth-date"
            name="birth-date"
            type="date"
            autoComplete="bday"
            required
            max={today()}
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="first-name"
            className="text-sm font-medium text-foreground"
          >
            First name
          </label>
          <Input
            id="first-name"
            name="first-name"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="John"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <Input
            id="name"
            name="name"
            autoComplete="family-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Abruzzi"
          />
        </div>
      </div>

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
          placeholder="john.abruzzi@example.com"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirm-password"
            className="text-sm font-medium text-foreground"
          >
            Confirm password
          </label>
          <Input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        type="submit"
        className="fx-shine mt-1 rounded-lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account..." : "Create my account"}
      </Button>
    </form>
  )
}
