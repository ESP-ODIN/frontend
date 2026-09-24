"use client"

import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { SelectInput } from "@/components/blocks/publish/fields/select-input"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { FILESYSTEM_ACCESS_OPTIONS } from "@/lib/publish/constants"
import type { FilesystemAccess } from "@/lib/publish/types"

export function FilesystemAccessSelect() {
  const { data, updatePermissions } = usePublishWizard()

  return (
    <FieldShell id="filesystem-access" label="Accès filesystem">
      <SelectInput
        id="filesystem-access"
        value={data.permissions.filesystemAccess}
        onChange={(value) =>
          updatePermissions({ filesystemAccess: value as FilesystemAccess })
        }
        options={FILESYSTEM_ACCESS_OPTIONS.map((option) => ({
          value: option.id,
          label: option.label,
        }))}
      />
    </FieldShell>
  )
}
