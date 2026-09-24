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
  isGeneralStepValid,
  isManifestStepValid,
  isPackageNameFormatValid,
  isPermissionsStepValid,
} from "@/lib/publish/validation"
import type {
  GeneralInfo,
  ManifestInfo,
  NameCheckStatus,
  PermissionsInfo,
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
  updateGeneral: (patch: Partial<GeneralInfo>) => void
  updateManifest: (patch: Partial<ManifestInfo>) => void
  updatePermissions: (patch: Partial<PermissionsInfo>) => void
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

// Lives in the provider rather than in the name field so a draft restored on a later
// step still gets its name re-checked (the field itself is only mounted on step 1).
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

// Mirrors the wizard into `?draft=` (replaceState: no history spam, no navigation)
// so a refresh restores it. Cleared once the agent is published.
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
  const nameCheckStatus = useNameAvailability(data.general.packageName)

  useDraftUrlSync(data, currentStepIndex, submission.status === "success")

  const updateGeneral = useCallback((patch: Partial<GeneralInfo>) => {
    setData((prev) => ({ ...prev, general: { ...prev.general, ...patch } }))
  }, [])

  const updateManifest = useCallback((patch: Partial<ManifestInfo>) => {
    setData((prev) => ({ ...prev, manifest: { ...prev.manifest, ...patch } }))
  }, [])

  const updatePermissions = useCallback((patch: Partial<PermissionsInfo>) => {
    setData((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, ...patch },
    }))
  }, [])

  const stepValidity = useMemo<Record<WizardStepId, boolean>>(
    () => ({
      general: isGeneralStepValid(data.general, nameCheckStatus),
      manifest: isManifestStepValid(data.manifest),
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
    updateGeneral,
    updateManifest,
    updatePermissions,
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
