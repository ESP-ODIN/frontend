"use client"

import { useState } from "react"
import { Rocket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/blocks/badge"
import { StepShell } from "@/components/blocks/publish/step-shell"
import { ReviewSection } from "@/components/blocks/publish/steps/review-section"
import { PublishResult } from "@/components/blocks/publish/steps/publish-result"
import { SecurityReviewDialog } from "@/components/blocks/publish/steps/security-review-dialog"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { publishAgent } from "@/lib/api/publish"
import { buildPublishPayload } from "@/lib/publish/build-payload"
import {
  FILESYSTEM_ACCESS_OPTIONS,
  MANIFEST_SOURCE_OPTIONS,
  RUNTIME_OPTIONS,
  TERMINAL_ACCESS_OPTIONS,
} from "@/lib/publish/constants"
import { categories } from "@/lib/data/categories"

export function StepReview() {
  const { data, stepValidity, submission, setSubmission } = usePublishWizard()
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)

  const runtimeLabel =
    RUNTIME_OPTIONS.find((option) => option.id === data.general.runtime)
      ?.label ?? "—"
  const categoryLabel =
    categories.find((category) => category.slug === data.general.category)
      ?.label ?? "—"
  const sourceLabel =
    MANIFEST_SOURCE_OPTIONS.find((option) => option.id === data.manifest.source)
      ?.label ?? "—"
  const filesystemLabel =
    FILESYSTEM_ACCESS_OPTIONS.find(
      (option) => option.id === data.permissions.filesystemAccess
    )?.label ?? "—"
  const terminalLabel =
    TERMINAL_ACCESS_OPTIONS.find(
      (option) => option.id === data.permissions.terminalAccess
    )?.label ?? "—"
  const canPublish =
    stepValidity.general && stepValidity.manifest && stepValidity.permissions

  async function handlePublish() {
    setSubmission({ status: "loading" })
    const result = await publishAgent(buildPublishPayload(data))
    if (result.ok) setIsReviewDialogOpen(true)
    setSubmission(
      result.ok
        ? { status: "success", slug: result.slug }
        : { status: "error", message: result.error }
    )
  }

  return (
    <StepShell
      title="Publier"
      description="Vérifiez les informations avant publication."
      footer={
        submission.status === "success" ? null : (
          <Button
            type="button"
            icon={Rocket}
            disabled={!canPublish || submission.status === "loading"}
            onClick={handlePublish}
            className="rounded-lg"
          >
            Publier l&apos;agent
          </Button>
        )
      }
    >
      <ReviewSection
        title="Informations générales"
        rows={[
          {
            label: "Nom du package",
            value: (
              <span className="font-mono">
                {data.general.packageName || "—"}
              </span>
            ),
          },
          { label: "Description", value: data.general.description || "—" },
          { label: "Type", value: data.general.type },
          { label: "Runtime", value: runtimeLabel },
          { label: "Catégorie", value: categoryLabel },
          {
            label: "Tags",
            value:
              data.general.tags.length > 0 ? (
                <div className="flex flex-wrap justify-end gap-1">
                  {data.general.tags.map((tag) => (
                    <Badge key={tag} size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                "—"
              ),
          },
        ]}
      />

      <ReviewSection
        title="Manifest"
        rows={[
          { label: "Source", value: sourceLabel },
          {
            label: "Repo",
            value: (
              <span className="font-mono text-xs">
                {data.manifest.repoUrl || "—"}
              </span>
            ),
          },
          {
            label: "Version",
            value: (
              <span className="font-mono">{data.manifest.version || "—"}</span>
            ),
          },
          {
            label: "Entrypoint",
            value: (
              <span className="font-mono">
                {data.manifest.entrypoint || "—"}
              </span>
            ),
          },
          {
            label: "Arguments",
            value:
              data.manifest.args.length > 0
                ? data.manifest.args.join(" ")
                : "—",
          },
          {
            label: "Changelog rédigé",
            value: data.manifest.changelog.trim().length > 0 ? "Oui" : "Non",
          },
        ]}
      />

      <ReviewSection
        title="Permissions"
        rows={[
          {
            label: "Accès internet",
            value: data.permissions.internetAccess ? "Oui" : "Non",
          },
          { label: "Filesystem", value: filesystemLabel },
          { label: "Terminal", value: terminalLabel },
          ...(data.permissions.terminalAccess === "restricted"
            ? [
                {
                  label: "Commandes autorisées",
                  value: (
                    <span className="font-mono">
                      {data.permissions.allowedCommands.join(", ") || "—"}
                    </span>
                  ),
                },
              ]
            : []),
          {
            label: "Variables d'env.",
            value:
              data.permissions.envVars.length > 0
                ? data.permissions.envVars.join(", ")
                : "—",
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
