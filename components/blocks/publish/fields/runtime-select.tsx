"use client"

import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { SelectInput } from "@/components/blocks/publish/fields/select-input"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { RUNTIME_OPTIONS } from "@/lib/publish/constants"
import type { RuntimeId } from "@/lib/publish/types"

export function RuntimeSelect() {
  const { data, updateSection } = usePublishWizard()

  return (
    <FieldShell id="runtime" label="Runtime" required>
      <SelectInput
        id="runtime"
        value={data.run.runtime}
        onChange={(value) =>
          updateSection("run", { runtime: value as RuntimeId })
        }
        options={RUNTIME_OPTIONS.map((option) => ({
          value: option.id,
          label: option.label,
        }))}
        placeholder="Select a runtime"
      />
    </FieldShell>
  )
}
