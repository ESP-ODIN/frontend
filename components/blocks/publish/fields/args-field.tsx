"use client"

import { StringListField } from "@/components/blocks/publish/fields/string-list-field"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"

export function ArgsField() {
  const { data, updateSection } = usePublishWizard()

  return (
    <StringListField
      id="args"
      label="Expected arguments"
      hint="One argument per line, e.g. --config."
      placeholder="--config"
      items={data.run.args}
      onChange={(args) => updateSection("run", { args })}
    />
  )
}
