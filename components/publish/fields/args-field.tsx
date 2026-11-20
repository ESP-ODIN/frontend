"use client"

import { StringListField } from "@/components/publish/fields/string-list-field"
import { usePublishWizard } from "@/components/publish/wizard-context"
import { DevMark } from "@/components/dev/dev-mark"
import { PUBLISH_MISSING_NOTES } from "@/lib/publish/dev-notes"

export function ArgsField() {
  const { data, updateSection } = usePublishWizard()

  return (
    <StringListField
      id="args"
      label="Expected arguments"
      trailing={<DevMark kind="missing" note={PUBLISH_MISSING_NOTES.args} />}
      hint="One argument per line, e.g. --config."
      placeholder="--config"
      items={data.run.args}
      onChange={(args) => updateSection("run", { args })}
    />
  )
}
