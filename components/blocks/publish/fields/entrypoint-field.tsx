"use client"

import { Input } from "@/components/ui/input"
import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"

export function EntrypointField() {
  const { data, updateManifest } = usePublishWizard()

  return (
    <FieldShell
      id="entrypoint"
      label="Entrypoint"
      required
      hint="Fichier de démarrage, ex. main.py."
    >
      <Input
        id="entrypoint"
        value={data.manifest.entrypoint}
        onChange={(event) => updateManifest({ entrypoint: event.target.value })}
        placeholder="main.py"
        className="font-mono"
      />
    </FieldShell>
  )
}
