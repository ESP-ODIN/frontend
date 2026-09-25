"use client"

import { Input } from "@/components/ui/input"
import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { isSemverValid } from "@/lib/publish/validation"

export function VersionField() {
  const { data, updateSection } = usePublishWizard()
  const value = data.package.version
  const error =
    value.length > 0 && !isSemverValid(value)
      ? "Format attendu : 1.0.0"
      : undefined

  return (
    <FieldShell
      id="version"
      label="Version"
      required
      error={error}
      hint={error ? undefined : "Semver, ex. 1.0.0."}
    >
      <Input
        id="version"
        value={value}
        onChange={(event) =>
          updateSection("package", { version: event.target.value })
        }
        placeholder="1.0.0"
        className="font-mono"
        aria-invalid={Boolean(error)}
      />
    </FieldShell>
  )
}
