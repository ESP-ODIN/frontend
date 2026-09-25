"use client"

import { useMemo, useState } from "react"
import { Rocket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StepShell } from "@/components/blocks/publish/step-shell"
import { ReviewSection } from "@/components/blocks/publish/steps/review-section"
import { ManifestPreview } from "@/components/blocks/publish/steps/manifest-preview"
import { PublishResult } from "@/components/blocks/publish/steps/publish-result"
import { SecurityReviewDialog } from "@/components/blocks/publish/steps/security-review-dialog"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { publishAgent } from "@/lib/api/publish"
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
    const result = await publishAgent(payload)
    if (result.ok) setIsReviewDialogOpen(true)
    setSubmission(
      result.ok
        ? { status: "success", slug: result.slug }
        : { status: "error", message: result.error }
    )
  }

  return (
    <StepShell
      title="Summary"
      description="The manifest generated from the form. This is what will be stored on publication."
      footer={
        submission.status === "success" ? null : (
          <Button
            type="button"
            icon={Rocket}
            disabled={!canPublish || submission.status === "loading"}
            onClick={handlePublish}
            className="rounded-lg"
          >
            Publish the agent
          </Button>
        )
      }
    >
      <ManifestPreview toml={toml} />

      <ReviewSection
        title="Submission"
        rows={[
          { label: "Source", value: sourceLabel },
          {
            label: "README",
            value: (
              <span>
                <span className="font-mono">
                  {payload.manifest.package.readme}
                </span>{" "}
                read from the repository
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
          slug={submission.slug}
        />
      )}
    </StepShell>
  )
}
