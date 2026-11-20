"use client"

import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import { Check, ExternalLink, Loader2, TriangleAlert, X } from "lucide-react"

import { checkAvailabilityAction } from "@/lib/auth/actions"
import {
  changePassword,
  deleteAccount,
  getProfileValues,
  PROFILE_NOTES,
  updateProfile,
  type CurrentUser,
  type ProfileValues,
} from "@/lib/api/profile"
import { validateNewPassword } from "@/lib/auth/password"
import { creatorHref } from "@/lib/agents/creator"
import { cn } from "@/lib/utils"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordStrength } from "@/components/auth/password-strength"
import { DevMark } from "@/components/dev/dev-mark"

type SettingsPanelProps = {
  user: CurrentUser
}

const BIO_MAX = 280
const EMPTY_PROFILE: ProfileValues = { firstName: "", lastName: "", username: "", bio: "" }
const NOTES = PROFILE_NOTES

function Card({ title, description, note, tone = "default", children }: {
  title: string
  description: string
  note: string
  tone?: "default" | "danger"
  children: ReactNode
}) {
  return (
    <section
      className={cn(
        "grid gap-5 rounded-2xl border bg-background-100 p-5 sm:p-6 lg:grid-cols-[16rem_1fr] lg:gap-10",
        tone === "danger" ? "border-destructive/30" : "border-muted/40"
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className={cn("flex items-center gap-2 font-semibold", tone === "danger" ? "text-destructive" : "text-foreground")}>
          {title} <DevMark kind="mock" note={note} />
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: ReactNode; error?: string | null; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">{error}</p>
      ) : (
        hint && <div className="text-xs text-muted-foreground">{hint}</div>
      )}
    </div>
  )
}

function Feedback({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="status" className="flex items-center gap-1.5 text-sm text-emerald-700 dark:text-emerald-400">
      <Check aria-hidden className="size-4" /> {message}
    </p>
  )
}

const textareaClass =
  "min-h-24 w-full rounded-2xl border border-input bg-input/30 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"

function ProfileForm({ user }: { user: CurrentUser }) {
  const [saved, setSaved] = useState<ProfileValues>(EMPTY_PROFILE)
  const [values, setValues] = useState<ProfileValues>(EMPTY_PROFILE)
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileValues, string>>>({})
  const [feedback, setFeedback] = useState<string | null>(null)
  const [availability, setAvailability] = useState<"idle" | "checking" | "available" | "taken" | "unknown">("idle")
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    getProfileValues(user).then((stored) => {
      setSaved(stored)
      setValues(stored)
    })
  }, [user])

  const username = values.username.trim()
  const debouncedUsername = useDebouncedValue(username, 400)
  const usernameChanged = username !== "" && username.toLowerCase() !== saved.username.trim().toLowerCase()

  useEffect(() => {
    if (!usernameChanged || debouncedUsername !== username || debouncedUsername.length < 3) {
      setAvailability("idle")
      return
    }
    let cancelled = false
    setAvailability("checking")
    checkAvailabilityAction("username", debouncedUsername).then((available) => {
      if (!cancelled) setAvailability(available === null ? "unknown" : available ? "available" : "taken")
    })
    return () => {
      cancelled = true
    }
  }, [debouncedUsername, username, usernameChanged])

  function update(field: keyof ProfileValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setFeedback(null)
    setFormError(null)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const next: typeof errors = {}
    if (!values.firstName.trim()) next.firstName = "Your first name is required."
    if (!values.lastName.trim()) next.lastName = "Your last name is required."
    if (username.length < 3 || username.length > 50) next.username = "Use between 3 and 50 characters."
    else if (availability === "taken") next.username = "This username is already taken."
    if (values.bio.length > BIO_MAX) next.bio = `Keep it under ${BIO_MAX} characters.`
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const clean = { ...values, firstName: values.firstName.trim(), lastName: values.lastName.trim(), username }
    setSaving(true)
    const result = await updateProfile(clean)
    setSaving(false)
    if (!result.ok) {
      if (result.field && result.field in clean) setErrors({ [result.field]: result.error })
      else setFormError(result.error)
      return
    }
    setSaved(clean)
    setValues(clean)
    setFeedback("Profile saved.")
  }

  const dirty = JSON.stringify(values) !== JSON.stringify(saved)

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="settings-first-name" label="First name" error={errors.firstName}>
          <Input id="settings-first-name" autoComplete="given-name" value={values.firstName} aria-invalid={!!errors.firstName} onChange={(e) => update("firstName", e.target.value)} />
        </Field>
        <Field id="settings-last-name" label="Last name" error={errors.lastName}>
          <Input id="settings-last-name" autoComplete="family-name" value={values.lastName} aria-invalid={!!errors.lastName} onChange={(e) => update("lastName", e.target.value)} />
        </Field>
      </div>
      <Field
        id="settings-username"
        label="Username"
        error={errors.username ?? (availability === "taken" ? "This username is already taken." : null)}
        hint={
          availability === "checking" ? (
            <span className="flex items-center gap-1"><Loader2 className="size-3 animate-spin" /> Checking availability…</span>
          ) : availability === "available" ? (
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400"><Check className="size-3" /> Available</span>
          ) : availability === "unknown" ? (
            "We couldn't check this username right now."
          ) : (
            "This is how other creators see you on the marketplace."
          )
        }
      >
        <div className="relative">
          <span aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">@</span>
          <Input id="settings-username" autoComplete="username" value={values.username} aria-invalid={!!errors.username || availability === "taken"} onChange={(e) => update("username", e.target.value)} className="pl-7" />
        </div>
      </Field>
      <Field id="settings-bio" label="Bio" error={errors.bio} hint={`${values.bio.length} / ${BIO_MAX}`}>
        <textarea
          id="settings-bio"
          value={values.bio}
          maxLength={BIO_MAX + 20}
          onChange={(e) => update("bio", e.target.value)}
          placeholder="What kind of agents do you build?"
          className={textareaClass}
        />
      </Field>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={creatorHref(user.id)} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
          View your public profile <ExternalLink aria-hidden className="size-3.5" />
        </Link>
        <div className="flex items-center gap-3">
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <Feedback message={feedback} />
          <Button type="submit" disabled={!dirty || availability === "checking" || saving}>
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </div>
    </form>
  )
}

function PasswordForm() {
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({})
  const [feedback, setFeedback] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const found: typeof errors = {}
    if (!current) found.current = "Enter your current password."
    const rule = validateNewPassword(next)
    if (rule) found.next = rule
    else if (next === current) found.next = "Pick a password different from the current one."
    if (confirm !== next) found.confirm = "Passwords don't match."
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSaving(true)
    const result = await changePassword(current, next)
    setSaving(false)
    if (!result.ok) {
      setErrors(result.field === "next" ? { next: result.error } : { current: result.error })
      return
    }
    setCurrent("")
    setNext("")
    setConfirm("")
    setFeedback("Password updated.")
  }

  const reset = () => setFeedback(null)

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Field id="settings-current-password" label="Current password" error={errors.current}>
        <Input id="settings-current-password" type="password" autoComplete="current-password" value={current} aria-invalid={!!errors.current} onChange={(e) => { setCurrent(e.target.value); reset() }} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="settings-new-password" label="New password" error={errors.next}>
          <Input id="settings-new-password" type="password" autoComplete="new-password" value={next} aria-invalid={!!errors.next} onChange={(e) => { setNext(e.target.value); reset() }} />
        </Field>
        <Field id="settings-confirm-password" label="Confirm new password" error={errors.confirm}>
          <Input id="settings-confirm-password" type="password" autoComplete="new-password" value={confirm} aria-invalid={!!errors.confirm} onChange={(e) => { setConfirm(e.target.value); reset() }} />
        </Field>
      </div>
      {next && <PasswordStrength value={next} />}
      <div className="flex items-center justify-end gap-3">
        <Feedback message={feedback} />
        <Button type="submit" disabled={!current || !next || !confirm || saving}>
          {saving ? "Updating…" : "Update password"}
        </Button>
      </div>
    </form>
  )
}

function DeleteAccountForm({ email }: { email: string | null }) {
  const [typed, setTyped] = useState("")
  const [requested, setRequested] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const expected = email ?? "delete my account"
  const matches = typed.trim().toLowerCase() === expected.toLowerCase()

  if (requested) {
    return (
      <p role="status" className="flex items-start gap-2 text-sm text-foreground">
        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-emerald-600" />
        Deletion requested. We sent a confirmation link to {email ?? "your email"}; your account is deleted once you open it.
      </p>
    )
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        if (!matches) return
        const result = await deleteAccount()
        if (result.ok) setRequested(true)
        else setError(result.error)
      }}
      className="flex flex-col gap-4"
    >
      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-destructive" />
        Your account, your follows, likes and saves are deleted for good. Agents you published stay on the marketplace until you
        unpublish them.
      </p>
      <Field id="settings-delete-confirm" label={`Type ${email ? "your email" : "“delete my account”"} to confirm`} hint={<span className="font-mono">{expected}</span>}>
        <Input id="settings-delete-confirm" value={typed} autoComplete="off" onChange={(e) => setTyped(e.target.value)} />
      </Field>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" variant="destructive" disabled={!matches}>
          <X /> Delete my account
        </Button>
      </div>
    </form>
  )
}

/** Réglages du compte. Rien n'est relié à l'API auth pour l'instant (voir les DevMark). */
export function SettingsPanel({ user }: SettingsPanelProps) {
  const email = user.email ?? null
  return (
    <div className="flex flex-col gap-6">
      <Card title="Public profile" description="Your name, username and bio, shown on your creator page and on your agents." note={NOTES.profile}>
        <ProfileForm user={user} />
      </Card>
      <Card title="Email" description="Used to sign in and to receive review results." note={NOTES.email}>
        <Field id="settings-email" label="Email address" hint="Changing your email isn't available yet.">
          <Input id="settings-email" type="email" value={email ?? ""} readOnly disabled />
        </Field>
      </Card>
      <Card title="Password" description="Use at least 8 characters, with upper and lowercase letters, a number and a symbol." note={NOTES.password}>
        <PasswordForm />
      </Card>
      <Card title="Delete account" description="This can't be undone." note={NOTES.delete} tone="danger">
        <DeleteAccountForm email={email} />
      </Card>
    </div>
  )
}
