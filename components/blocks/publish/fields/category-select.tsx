"use client"

import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { SelectInput } from "@/components/blocks/publish/fields/select-input"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { categories } from "@/lib/data/categories"

export function CategorySelect() {
  const { data, updateSection } = usePublishWizard()

  return (
    <FieldShell id="category" label="Category" required>
      <SelectInput
        id="category"
        value={data.package.category}
        onChange={(value) => updateSection("package", { category: value })}
        options={categories.map((category) => ({
          value: category.slug,
          label: category.label,
        }))}
        placeholder="Select a category"
      />
    </FieldShell>
  )
}
