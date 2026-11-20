"use client"

import { useMemo, useState } from "react"
import { Rocket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StepShell } from "@/components/publish/step-shell"
import { ReviewSection } from "@/components/publish/steps/review-section"
import { ManifestPreview } from "@/components/publish/steps/manifest-preview"
import { PublishResult } from "@/components/publish/steps/publish-result"
import { SecurityReviewDialog } from "@/components/publish/steps/security-review-dialog"
import { usePublishWizard } from "@/components/publish/wizard-context"
import { publishAgentAction } from "@/lib/publish/actions"
import { addSubmission } from "@/lib/publish/submissions"
import { DevMark } from "@/components/dev/dev-mark"
import { PUBLISH_MISSING_NOTES } from "@/lib/publish/dev-notes"
import { buildPublishPayload } from "@/lib/publish/build-payload"
import { MANIFEST_SOURCE_OPTIONS, WIZARD_STEPS } from "@/lib/publish/constants"
import { stringifyManifestToml } from "@/lib/publish/manifest-toml"

export function StepReview() {
  const { data, stepValidity, submission, setSubmission } = usePublishWizard()
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)

  const payload = useMemo(() => buildPublishPayload(data), [data])
  const toml = useMemo(
    () => stringifyManifestToml(payload.manifest),
    [payload.manifest]
  )

  const sourceLabel =
    MANIFEST_SOURCE_OPTIONS.find((option) => option.id === data.source.kind)
      ?.label ?? "—"
  const canPublish = WIZARD_STEPS.every((step) => stepValidity[step.id])

  async function handlePublish() {
    setSubmission({ status: "loading" })
    try {
      const result = await publishAgentAction(payload)
      if (result.ok) {
        const { name, version, type, category } = payload.manifest.package
        // Suivi de la revue dans /profile?tab=creator, en attendant un statut côté API.
        addSubmission({ name, version, type, category, runtime: payload.manifest.run.runtime })
        setIsReviewDialogOpen(true)
      }
      setSubmission(
        result.ok
          ? { status: "success", id: result.id, name: result.name }
          : { status: "error", message: result.error }
      )
    } catch {
      setSubmission({ status: "error", message: "Network error. Please try again later." })
    }
  }

  return (
    <StepShell
      title="Summary"
      description="The manifest generated from the form. This is what will be stored on publication."
      footer={
        submission.status === "success" ? null : (
          <span className="flex items-center gap-3">
            <Button
              type="button"
              icon={Rocket}
              disabled={!canPublish || submission.status === "loading"}
              onClick={handlePublish}
              className="rounded-lg"
            >
              Publish the agent
            </Button>
          </span>
        )
      }
    >
      <ManifestPreview toml={toml} />

      <ReviewSection
        title="Submission"
        rows={[
          {
            label: "Source",
            value: (
              <span className="inline-flex items-center gap-2">
                {sourceLabel}
                <DevMark kind="missing" note={PUBLISH_MISSING_NOTES.repository} />
              </span>
            ),
          },
          {
            label: "README",
            value: (
              <span className="inline-flex items-center gap-2">
                <span>
                  <span className="font-mono">
                    {payload.manifest.package.readme}
                  </span>{" "}
                  read from the repository
                </span>
                <DevMark kind="mock" note={PUBLISH_MISSING_NOTES.readme} />
              </span>
            ),
          },
        ]}
      />

      {submission.status !== "idle" && <PublishResult />}
      {submission.status === "success" && (
        <SecurityReviewDialog
          open={isReviewDialogOpen}
          onOpenChange={setIsReviewDialogOpen}
          name={submission.name}
        />
      )}
    </StepShell>
  )
}
