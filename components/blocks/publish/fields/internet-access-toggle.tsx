"use client"

import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { ToggleSwitch } from "@/components/blocks/publish/fields/toggle-switch"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"

export function InternetAccessToggle() {
  const { data, updateSection } = usePublishWizard()

  return (
    <FieldShell
      id="internet-access"
      label="Internet access"
      hint="Can the agent make outbound network requests?"
    >
      <ToggleSwitch
        id="internet-access"
        checked={data.permissions.network}
        onChange={(checked) =>
          updateSection("permissions", { network: checked })
        }
        label="Internet access"
      />
    </FieldShell>
  )
}
