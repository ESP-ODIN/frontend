"use client"

import { MANIFEST_SOURCE_OPTIONS } from "@/lib/publish/constants"
import { ChoiceCard } from "@/components/blocks/publish/fields/choice-card"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"

export function ManifestSourceSelector() {
  const { data, updateSection } = usePublishWizard()

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium text-foreground">
        Source du manifest<span className="ml-0.5 text-primary">*</span>
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {MANIFEST_SOURCE_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.id}
            icon={option.icon}
            label={option.label}
            description={option.description}
            selected={data.source.kind === option.id}
            onSelect={() => updateSection("source", { kind: option.id })}
          />
        ))}
      </div>
    </div>
  )
}
