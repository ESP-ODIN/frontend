"use client"

import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { TextAreaBase } from "@/components/blocks/publish/fields/text-area-base"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"

export function ChangelogField() {
  const { data, updateSection } = usePublishWizard()

  return (
    <FieldShell
      id="changelog"
      label="Changelog for this version"
      required
      hint="Summarize what changes in this version. Markdown supported, stored as-is in the manifest."
    >
      <TextAreaBase
        id="changelog"
        value={data.package.changelog}
        onChange={(event) =>
          updateSection("package", { changelog: event.target.value })
        }
        placeholder={"## 1.0.0\n\n- First release."}
        className="min-h-28 font-mono text-xs"
      />
    </FieldShell>
  )
}
