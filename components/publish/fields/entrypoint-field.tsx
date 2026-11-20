"use client"

import { Input } from "@/components/ui/input"
import { FieldShell } from "@/components/publish/fields/field-shell"
import { usePublishWizard } from "@/components/publish/wizard-context"
import { DevMark } from "@/components/dev/dev-mark"
import { PUBLISH_MISSING_NOTES } from "@/lib/publish/dev-notes"

export function EntrypointField() {
  const { data, updateSection } = usePublishWizard()

  return (
    <FieldShell
      id="entrypoint"
      label="Entrypoint"
      required
      trailing={
        <DevMark kind="missing" note={PUBLISH_MISSING_NOTES.entrypoint} />
      }
      hint="Startup file, e.g. main.py."
    >
      <Input
        id="entrypoint"
        value={data.run.entrypoint}
        onChange={(event) =>
          updateSection("run", { entrypoint: event.target.value })
        }
        placeholder="main.py"
        className="font-mono"
      />
    </FieldShell>
  )
}
