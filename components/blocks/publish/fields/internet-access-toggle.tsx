"use client"

import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { ToggleSwitch } from "@/components/blocks/publish/fields/toggle-switch"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"

export function InternetAccessToggle() {
  const { data, updatePermissions } = usePublishWizard()

  return (
    <FieldShell
      id="internet-access"
      label="Accès internet"
      hint="L'agent peut-il effectuer des requêtes réseau sortantes ?"
    >
      <ToggleSwitch
        id="internet-access"
        checked={data.permissions.internetAccess}
        onChange={(checked) => updatePermissions({ internetAccess: checked })}
        label="Accès internet"
      />
    </FieldShell>
  )
}
