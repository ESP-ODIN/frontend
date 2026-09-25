"use client"

import { Check, Loader2, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import {
  isPackageNameFormatValid,
  PACKAGE_NAME_REGEX,
} from "@/lib/publish/validation"
import type { NameCheckStatus } from "@/lib/publish/types"

function NameCheckIndicator({
  status,
  hasValue,
}: {
  status: NameCheckStatus
  hasValue: boolean
}) {
  if (!hasValue) return null
  if (status === "checking")
    return <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
  if (status === "available")
    return <Check className="fx-pop size-3.5 text-emerald-600" />
  if (status === "taken" || status === "error")
    return <X className="size-3.5 text-destructive" />
  return null
}

export function PackageNameField() {
  const { data, updateSection, nameCheckStatus } = usePublishWizard()
  const packageName = data.package.name

  const formatError =
    packageName.length > 0 && !isPackageNameFormatValid(packageName)
      ? "Lowercase letters and hyphens only (e.g. my-agent)."
      : undefined

  const statusError = formatError
    ? undefined
    : nameCheckStatus === "taken"
      ? "This name is already taken."
      : nameCheckStatus === "error"
        ? "Unable to check this name right now."
        : undefined

  return (
    <FieldShell
      id="package-name"
      label="Package name"
      required
      error={formatError ?? statusError}
      hint="Lowercase letters, digits and hyphens only (kebab-case)."
      trailing={
        <NameCheckIndicator
          status={nameCheckStatus}
          hasValue={packageName.length > 0}
        />
      }
    >
      <Input
        id="package-name"
        value={packageName}
        onChange={(event) =>
          updateSection("package", { name: event.target.value.toLowerCase() })
        }
        placeholder="my-agent"
        className="font-mono"
        pattern={PACKAGE_NAME_REGEX.source}
        aria-invalid={Boolean(formatError ?? statusError)}
      />
    </FieldShell>
  )
}
