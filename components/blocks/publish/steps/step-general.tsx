"use client"

import { StepShell } from "@/components/blocks/publish/step-shell"
import { PackageNameField } from "@/components/blocks/publish/fields/package-name-field"
import { DescriptionField } from "@/components/blocks/publish/fields/description-field"
import { AgentTypeSelector } from "@/components/blocks/publish/fields/agent-type-selector"
import { TagsField } from "@/components/blocks/publish/fields/tags-field"
import { RuntimeSelect } from "@/components/blocks/publish/fields/runtime-select"
import { CategorySelect } from "@/components/blocks/publish/fields/category-select"

export function StepGeneral() {
  return (
    <StepShell
      title="Informations générales"
      description="Identité et classification de votre package."
    >
      <PackageNameField />
      <DescriptionField />
      <AgentTypeSelector />
      <div className="grid gap-6 sm:grid-cols-2">
        <RuntimeSelect />
        <CategorySelect />
      </div>
      <TagsField />
    </StepShell>
  )
}
