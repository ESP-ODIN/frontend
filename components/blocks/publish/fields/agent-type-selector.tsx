"use client"

import { AGENT_TYPE_OPTIONS } from "@/lib/publish/constants"
import { ChoiceCard } from "@/components/blocks/publish/fields/choice-card"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"

export function AgentTypeSelector() {
  const { data, updateSection } = usePublishWizard()

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium text-foreground">
        Agent type<span className="ml-0.5 text-primary">*</span>
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {AGENT_TYPE_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.id}
            icon={option.icon}
            label={option.label}
            description={option.description}
            selected={data.package.type === option.id}
            onSelect={() => updateSection("package", { type: option.id })}
          />
        ))}
      </div>
    </div>
  )
}
