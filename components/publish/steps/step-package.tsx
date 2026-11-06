"use client"

import { StepShell } from "@/components/publish/step-shell"
import { FormSection } from "@/components/publish/form-section"
import { PackageNameField } from "@/components/publish/fields/package-name-field"
import { VersionField } from "@/components/publish/fields/version-field"
import { DescriptionField } from "@/components/publish/fields/description-field"
import { AgentTypeSelector } from "@/components/publish/fields/agent-type-selector"
import { CategorySelect } from "@/components/publish/fields/category-select"
import { TagsField } from "@/components/publish/fields/tags-field"
import { ChangelogField } from "@/components/publish/fields/changelog-field"

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
