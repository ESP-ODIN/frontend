"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import { checkNameAvailability } from "@/lib/api/publish"
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value"
import { DEFAULT_FORM_DATA, WIZARD_STEPS } from "@/lib/publish/constants"
import {
  DRAFT_PARAM,
  serializeDraft,
  type PublishDraft,
} from "@/lib/publish/url-state"
import {
  isPackageNameFormatValid,
  isPackageStepValid,
  isPermissionsStepValid,
  isRunStepValid,
  isSourceStepValid,
} from "@/lib/publish/validation"
import type {
  NameCheckStatus,
  PublishFormData,
  WizardStepId,
} from "@/lib/publish/types"

type SubmissionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; slug: string }
  | { status: "error"; message: string }

type WizardContextValue = {
  data: PublishFormData
  updateSection: <K extends keyof PublishFormData>(
    section: K,
    patch: Partial<PublishFormData[K]>
  ) => void
  nameCheckStatus: NameCheckStatus
  currentStepIndex: number
  currentStepId: WizardStepId
  goToStep: (index: number) => void
  goNext: () => void
  goBack: () => void
  stepValidity: Record<WizardStepId, boolean>
  submission: SubmissionState
  setSubmission: (state: SubmissionState) => void
}

const WizardContext = createContext<WizardContextValue | null>(null)

function useNameAvailability(packageName: string): NameCheckStatus {
  const [status, setStatus] = useState<NameCheckStatus>("idle")
  const debouncedName = useDebouncedValue(packageName, 400)
  const requestId = useRef(0)

  useEffect(() => {
    const id = ++requestId.current
    if (!debouncedName || !isPackageNameFormatValid(debouncedName)) {
      setStatus("idle")
      return
    }

    setStatus("checking")
    checkNameAvailability(debouncedName)
      .then((result) => {
        if (requestId.current === id)
          setStatus(result.available ? "available" : "taken")
      })
      .catch(() => {
        if (requestId.current === id) setStatus("error")
      })
  }, [debouncedName])

  return status
}

function useDraftUrlSync(
  data: PublishFormData,
  step: number,
  published: boolean
) {
  useEffect(() => {
    const isPristine = data === DEFAULT_FORM_DATA && step === 0
    const timeout = setTimeout(() => {
      const url = new URL(window.location.href)
      if (published || isPristine) url.searchParams.delete(DRAFT_PARAM)
      else url.searchParams.set(DRAFT_PARAM, serializeDraft({ data, step }))
      window.history.replaceState(null, "", url)
    }, 300)
    return () => clearTimeout(timeout)
  }, [data, step, published])
}

export function PublishWizardProvider({
  initialDraft,
  children,
}: {
  initialDraft: PublishDraft | null
  children: ReactNode
}) {
  const [data, setData] = useState<PublishFormData>(
    initialDraft?.data ?? DEFAULT_FORM_DATA
  )
  const [currentStepIndex, setCurrentStepIndex] = useState(
    initialDraft?.step ?? 0
  )
  const [submission, setSubmission] = useState<SubmissionState>({
    status: "idle",
  })
  const nameCheckStatus = useNameAvailability(data.package.name)

  useDraftUrlSync(data, currentStepIndex, submission.status === "success")

  const updateSection = useCallback(
    <K extends keyof PublishFormData>(
      section: K,
      patch: Partial<PublishFormData[K]>
    ) => {
      setData((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...patch },
      }))
    },
    []
  )

  const stepValidity = useMemo<Record<WizardStepId, boolean>>(
    () => ({
      source: isSourceStepValid(data.source),
      package: isPackageStepValid(data.package, nameCheckStatus),
      run: isRunStepValid(data.run),
      permissions: isPermissionsStepValid(data.permissions),
      review: true,
    }),
    [data, nameCheckStatus]
  )

  const goToStep = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), WIZARD_STEPS.length - 1)
      const canJump = WIZARD_STEPS.slice(0, clamped).every(
        (step) => stepValidity[step.id]
      )
      if (canJump) setCurrentStepIndex(clamped)
    },
    [stepValidity]
  )

  const goNext = useCallback(() => {
    const currentId = WIZARD_STEPS[currentStepIndex].id
    if (stepValidity[currentId])
      setCurrentStepIndex((i) => Math.min(i + 1, WIZARD_STEPS.length - 1))
  }, [currentStepIndex, stepValidity])

  const goBack = useCallback(
    () => setCurrentStepIndex((i) => Math.max(i - 1, 0)),
    []
  )

  const value: WizardContextValue = {
    data,
    updateSection,
    nameCheckStatus,
    currentStepIndex,
    currentStepId: WIZARD_STEPS[currentStepIndex].id,
    goToStep,
    goNext,
    goBack,
    stepValidity,
    submission,
    setSubmission,
  }

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  )
}

export function usePublishWizard() {
  const ctx = useContext(WizardContext)
  if (!ctx)
    throw new Error(
      "usePublishWizard must be used within a PublishWizardProvider"
    )
  return ctx
}
