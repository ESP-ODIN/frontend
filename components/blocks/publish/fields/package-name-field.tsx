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
  const { data, updateGeneral, nameCheckStatus } = usePublishWizard()
  const packageName = data.general.packageName

  const formatError =
    packageName.length > 0 && !isPackageNameFormatValid(packageName)
      ? "Minuscules et tirets uniquement (ex. mon-agent)."
      : undefined

  const statusError = formatError
    ? undefined
    : nameCheckStatus === "taken"
      ? "Ce nom est déjà utilisé."
      : nameCheckStatus === "error"
        ? "Impossible de vérifier ce nom pour l'instant."
        : undefined

  return (
    <FieldShell
      id="package-name"
      label="Nom du package"
      required
      error={formatError ?? statusError}
      hint="Minuscules, chiffres et tirets uniquement (kebab-case)."
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
          updateGeneral({ packageName: event.target.value.toLowerCase() })
        }
        placeholder="mon-agent"
        className="font-mono"
        pattern={PACKAGE_NAME_REGEX.source}
        aria-invalid={Boolean(formatError ?? statusError)}
      />
    </FieldShell>
  )
}
