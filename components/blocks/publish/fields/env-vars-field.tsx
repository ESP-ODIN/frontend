"use client"

import { StringListField } from "@/components/blocks/publish/fields/string-list-field"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { isEnvVarNameValid } from "@/lib/publish/validation"

export function EnvVarsField() {
  const { data, updateSection } = usePublishWizard()

  return (
    <StringListField
      id="env-vars"
      label="Required environment variables"
      hint="The variable name only, e.g. OPENAI_API_KEY."
      placeholder="OPENAI_API_KEY"
      items={data.permissions.env}
      onChange={(env) => updateSection("permissions", { env })}
      validate={isEnvVarNameValid}
      invalidHint="Uppercase letters, digits and underscores only."
    />
  )
}
