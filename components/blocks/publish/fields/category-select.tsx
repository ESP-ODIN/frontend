"use client"

import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { SelectInput } from "@/components/blocks/publish/fields/select-input"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { categories } from "@/lib/data/categories"

export function CategorySelect() {
  const { data, updateGeneral } = usePublishWizard()

  return (
    <FieldShell id="category" label="Catégorie" required>
      <SelectInput
        id="category"
        value={data.general.category}
        onChange={(value) => updateGeneral({ category: value })}
        options={categories.map((category) => ({
          value: category.slug,
          label: category.label,
        }))}
        placeholder="Sélectionner une catégorie"
      />
    </FieldShell>
  )
}
