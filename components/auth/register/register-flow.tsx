"use client"

/**
 * Inscription conversationnelle : une question à la fois, avec une carte de profil qui se remplit
 * en direct et permet de revenir corriger une réponse.
 */

import { useState, type FormEvent, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Cake,
  Check,
  CornerDownLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StepTransition } from "@/components/publish/step-transition"
import { registerAction } from "@/lib/auth/actions"
import { cn } from "@/lib/utils"

type Values = {
  firstName: string
  name: string
  username: string
  birthDate: string
  email: string
  password: string
  confirm: string
}

type StepId = keyof Values

type Step = {
  id: StepId
  question: (v: Values) => string
  hint?: string
  type?: "text" | "email" | "date" | "password"
  autoComplete: string
  placeholder?: string
  validate: (value: string, v: Values) => string | null
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function today() {
  return new Date().toISOString().slice(0, 10)
}

function suggestUsername(v: Values) {
  return `${v.firstName.charAt(0)}${v.name}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]/g, "")
}

const STEPS: Step[] = [
  {
    id: "firstName",
    question: () => "First things first, what's your first name?",
    autoComplete: "given-name",
    placeholder: "John",
    validate: (value) =>
      value.trim() ? null : "We need a first name to continue.",
  },
  {
    id: "name",
    question: (v) =>
      `Nice to meet you, ${v.firstName.trim()}. And your last name?`,
    autoComplete: "family-name",
    placeholder: "Abruzzi",
    validate: (value) => (value.trim() ? null : "Your last name is required."),
  },
  {
    id: "username",
    question: () => "Pick a username for the marketplace.",
    hint: "This is how other creators will see you.",
    autoComplete: "username",
    placeholder: "jabruzzi",
    validate: (value) => (value.trim() ? null : "Choose a username."),
  },
  {
    id: "birthDate",
    question: () => "When were you born?",
    type: "date",
    autoComplete: "bday",
    validate: (value) => {
      if (!value) return "Your birth date is required."
      if (value > today()) return "That date is in the future."
      return null
    },
  },
  {
    id: "email",
    question: () => "Where can we reach you?",
    type: "email",
    autoComplete: "email",
    placeholder: "john.abruzzi@example.com",
    validate: (value) =>
      EMAIL_RE.test(value) ? null : "That doesn't look like a valid email.",
  },
  {
    id: "password",
    question: () => "Now, secure your account with a password.",
    hint: "Between 8 and 72 characters.",
    type: "password",
    autoComplete: "new-password",
    placeholder: "••••••••",
    validate: (value) =>
      value.length < 8 || value.length > 72
        ? "Use between 8 and 72 characters."
        : null,
  },
  {
    id: "confirm",
    question: () => "Type it once more, just to be sure.",
    type: "password",
    autoComplete: "new-password",
    placeholder: "••••••••",
    validate: (value, v) =>
      value === v.password ? null : "Passwords don't match.",
  },
]

/** "1990-03-14" -> "March 14, 1990", sans passer par UTC (sinon décalage d'un jour selon le fuseau). */
function formatBirthDate(value: string) {
  const [y, m, d] = value.split("-").map(Number)
  if (!y || !m || !d) return ""
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

const stepIndex = (id: StepId) => STEPS.findIndex((s) => s.id === id)

type ProfilePreviewProps = {
  values: Values
  current: number
  disabled: boolean
  onEdit: (index: number) => void
}

type FieldProps = Omit<ProfilePreviewProps, "values"> & {
  id: StepId
  children: ReactNode
  className?: string
}

/** Info du profil : cliquable seulement si son étape est déjà passée. */
function Field({
  id,
  current,
  disabled,
  onEdit,
  children,
  className,
}: FieldProps) {
  const i = stepIndex(id)
  const editable = i < current && !disabled
  return (
    <button
      type="button"
      disabled={!editable}
      onClick={() => onEdit(i)}
      title={editable ? "Edit" : undefined}
      className={cn(
        "min-w-0 truncate rounded-sm text-left transition-colors",
        editable && "cursor-pointer hover:text-primary",
        className
      )}
    >
      {children}
    </button>
  )
}

/** Bloc gris à la place d'une info pas encore renseignée. */
function Placeholder({ className }: { className: string }) {
  return (
    <span
      className={cn(
        "inline-block h-3 rounded-full bg-muted/25 align-middle",
        className
      )}
    />
  )
}

/** Carte de profil qui se construit en direct pendant la saisie. */
function ProfilePreview({ values, ...fieldProps }: ProfilePreviewProps) {
  const initials =
    `${values.firstName.trim().charAt(0)}${values.name.trim().charAt(0)}`.toUpperCase()
  const fullName = `${values.firstName} ${values.name}`.trim()
  const birthDate = formatBirthDate(values.birthDate)
  const passwordSet = fieldProps.current > stepIndex("password")

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-input/20 p-4">
      <span
        className={cn(
          "inline-flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold transition-colors duration-500",
          initials
            ? "bg-gradient-to-br from-primary to-orange-400 text-primary-foreground shadow-md shadow-primary/20"
            : "bg-muted/20 text-muted-foreground"
        )}
      >
        {initials || "?"}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Field
          {...fieldProps}
          id={values.name ? "name" : "firstName"}
          className="text-lg font-semibold text-foreground"
        >
          {fullName || <Placeholder className="h-4 w-40" />}
        </Field>

        <Field {...fieldProps} id="username" className="text-sm text-primary">
          {values.username ? (
            `@${values.username}`
          ) : (
            <Placeholder className="w-24" />
          )}
        </Field>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <Cake className="size-3.5 shrink-0" />
            <Field {...fieldProps} id="birthDate">
              {birthDate || <Placeholder className="w-20" />}
            </Field>
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <Mail className="size-3.5 shrink-0" />
            <Field {...fieldProps} id="email">
              {values.email || <Placeholder className="w-28" />}
            </Field>
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 transition-colors",
              passwordSet && "text-emerald-600"
            )}
          >
            {passwordSet ? (
              <Check className="size-3.5" />
            ) : (
              <Lock className="size-3.5" />
            )}
            {passwordSet ? "Password set" : "No password yet"}
          </span>
        </div>
      </div>
    </div>
  )
}

const EMPTY: Values = {
  firstName: "",
  name: "",
  username: "",
  birthDate: "",
  email: "",
  password: "",
  confirm: "",
}

export function RegisterFlow() {
  const router = useRouter()
  const [values, setValues] = useState<Values>(EMPTY)
  const [index, setIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const step = STEPS[index]
  const isLast = index === STEPS.length - 1
  const value = values[step.id]
  const suggestion = step.id === "username" ? suggestUsername(values) : ""

  function goTo(next: number) {
    setError(null)
    setShowPassword(false)
    setIndex(next)
  }

  function setValue(next: string) {
    setError(null)
    setValues((prev) => ({ ...prev, [step.id]: next }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationError = step.validate(value, values)
    if (validationError) {
      setError(validationError)
      return
    }
    if (!isLast) {
      goTo(index + 1)
      return
    }

    setIsSubmitting(true)
    const result = await registerAction({
      username: values.username.trim(),
      name: values.name.trim(),
      first_name: values.firstName.trim(),
      birth_date: values.birthDate,
      email: values.email.trim(),
      password: values.password,
    })
    setIsSubmitting(false)

    if (!result.ok) {
      // Les erreurs de l'API (email déjà pris, format invalide) concernent l'email : on y retourne.
      const emailStep = STEPS.findIndex((s) => s.id === "email")
      setIndex(emailStep)
      setShowPassword(false)
      setError(result.error)
      return
    }

    setDone(true)
    setTimeout(() => router.push("/marketplace"), 1200)
  }

  if (done) {
    return (
      <StepTransition stepKey="done">
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="fx-pop inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="size-6" />
          </span>
          <p className="text-xl font-semibold text-foreground">
            Welcome aboard, {values.firstName.trim()}!
          </p>
          <p className="text-sm text-muted-foreground">
            Taking you to the marketplace…
          </p>
        </div>
      </StepTransition>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Progression : chaque segment déjà franchi est cliquable pour revenir en arrière. */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              disabled={i >= index || isSubmitting}
              onClick={() => goTo(i)}
              aria-label={`Go back to step ${i + 1}`}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                i < index && "cursor-pointer bg-primary hover:bg-primary/70",
                i === index && "bg-primary/50",
                i > index && "bg-muted/30"
              )}
            />
          ))}
        </div>
        <p className="font-mono text-xs tracking-wider text-muted-foreground">
          STEP {index + 1} / {STEPS.length}
        </p>
      </div>

      <ProfilePreview
        values={values}
        current={index}
        disabled={isSubmitting}
        onEdit={goTo}
      />

      <StepTransition stepKey={step.id}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor={step.id}
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              {step.question(values)}
            </label>
            {step.hint && (
              <p className="text-sm text-muted-foreground">{step.hint}</p>
            )}
          </div>

          <div className="relative">
            <Input
              key={step.id}
              id={step.id}
              name={step.id}
              autoFocus
              type={
                step.type === "password" && showPassword
                  ? "text"
                  : (step.type ?? "text")
              }
              autoComplete={step.autoComplete}
              placeholder={step.placeholder}
              max={step.type === "date" ? today() : undefined}
              maxLength={step.type === "password" ? 72 : undefined}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              aria-invalid={error ? true : undefined}
              className={cn(
                "h-11 text-base md:text-base",
                step.type === "password" && "pr-11"
              )}
            />
            {step.type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            )}
          </div>

          {suggestion && value !== suggestion && (
            <button
              type="button"
              onClick={() => setValue(suggestion)}
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs text-primary transition-colors hover:bg-primary/10"
            >
              <Sparkles className="size-3" />
              Use @{suggestion}
            </button>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              className="rounded-lg"
              disabled={index === 0 || isSubmitting}
              onClick={() => goTo(index - 1)}
            >
              <ArrowLeft data-icon="inline-start" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
                press Enter <CornerDownLeft className="size-3" />
              </span>
              <Button
                type="submit"
                className="fx-shine rounded-lg"
                disabled={isSubmitting}
              >
                {isLast
                  ? isSubmitting
                    ? "Creating account..."
                    : "Create my account"
                  : "Continue"}
                {!isSubmitting && <ArrowRight data-icon="inline-end" />}
              </Button>
            </div>
          </div>
        </form>
      </StepTransition>
    </div>
  )
}
