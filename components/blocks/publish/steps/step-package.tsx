"use client"

import { StepShell } from "@/components/blocks/publish/step-shell"
import { FormSection } from "@/components/blocks/publish/form-section"
import { PackageNameField } from "@/components/blocks/publish/fields/package-name-field"
import { VersionField } from "@/components/blocks/publish/fields/version-field"
import { DescriptionField } from "@/components/blocks/publish/fields/description-field"
import { AgentTypeSelector } from "@/components/blocks/publish/fields/agent-type-selector"
import { CategorySelect } from "@/components/blocks/publish/fields/category-select"
import { TagsField } from "@/components/blocks/publish/fields/tags-field"
import { ChangelogField } from "@/components/blocks/publish/fields/changelog-field"

export function StepPackage() {
  return (
    <StepShell
      title="Package"
      description="Your agent's identity, classification and release notes."
    >
      <FormSection title="Identity" table="package">
        <div className="grid gap-6 sm:grid-cols-2">
          <PackageNameField />
          <VersionField />
        </div>
        <DescriptionField />
      </FormSection>

      <FormSection title="Classification" table="package">
        <AgentTypeSelector />
        <CategorySelect />
        <TagsField />
      </FormSection>

      <FormSection title="Release notes" table="package">
        <ChangelogField />
      </FormSection>
    </StepShell>
  )
}
