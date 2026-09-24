"use client"

import { Input } from "@/components/ui/input"
import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"

export function HomepageUrlField() {
  const { data, updateManifest } = usePublishWizard()

  return (
    <FieldShell
      id="homepage-url"
      label="Documentation / site (optionnel)"
      hint="Lien vers la documentation ou le site du projet."
    >
      <Input
        id="homepage-url"
        value={data.manifest.homepageUrl}
        onChange={(event) =>
          updateManifest({ homepageUrl: event.target.value })
        }
        placeholder="https://docs.mon-agent.dev"
        className="font-mono"
      />
    </FieldShell>
  )
}
