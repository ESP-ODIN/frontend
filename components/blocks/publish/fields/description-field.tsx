"use client"

import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { TextAreaBase } from "@/components/blocks/publish/fields/text-area-base"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { cn } from "@/lib/utils"

const MAX_LENGTH = 120

export function DescriptionField() {
  const { data, updateSection } = usePublishWizard()
  const value = data.package.description

  return (
    <FieldShell
      id="description"
      label="Description courte"
      required
      trailing={
        <span
          className={cn(
            "font-mono text-xs",
            value.length > MAX_LENGTH
              ? "text-destructive"
              : "text-muted-foreground"
          )}
        >
          {value.length}/{MAX_LENGTH}
        </span>
      }
    >
      <TextAreaBase
        id="description"
        value={value}
        maxLength={MAX_LENGTH}
        onChange={(event) =>
          updateSection("package", { description: event.target.value })
        }
        placeholder="Ce que fait votre agent, en une phrase."
        className="min-h-20"
      />
    </FieldShell>
  )
}
