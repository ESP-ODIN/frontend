"use client"

import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { TextAreaBase } from "@/components/blocks/publish/fields/text-area-base"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"

export function ChangelogField() {
  const { data, updateManifest } = usePublishWizard()

  return (
    <FieldShell
      id="changelog"
      label="Changelog de cette version"
      required
      hint="Résumez ce qui change dans cette version."
    >
      <TextAreaBase
        id="changelog"
        value={data.manifest.changelog}
        onChange={(event) => updateManifest({ changelog: event.target.value })}
        placeholder={"## 1.0.0\n\n- Première publication."}
        className="min-h-28 font-mono text-xs"
      />
    </FieldShell>
  )
}
