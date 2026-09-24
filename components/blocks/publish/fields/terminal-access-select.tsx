"use client"

import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { SelectInput } from "@/components/blocks/publish/fields/select-input"
import { StringListField } from "@/components/blocks/publish/fields/string-list-field"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { TERMINAL_ACCESS_OPTIONS } from "@/lib/publish/constants"
import { isCommandNameValid } from "@/lib/publish/validation"
import type { TerminalAccess } from "@/lib/publish/types"

export function TerminalAccessSelect() {
  const { data, updatePermissions } = usePublishWizard()
  const { terminalAccess, allowedCommands } = data.permissions

  return (
    <div className="flex flex-col gap-4">
      <FieldShell
        id="terminal-access"
        label="Accès terminal"
        hint="L'agent peut-il exécuter des commandes shell sur la machine ?"
      >
        <SelectInput
          id="terminal-access"
          value={terminalAccess}
          onChange={(value) =>
            updatePermissions({ terminalAccess: value as TerminalAccess })
          }
          options={TERMINAL_ACCESS_OPTIONS.map((option) => ({
            value: option.id,
            label: option.label,
            description: option.description,
          }))}
        />
      </FieldShell>
      {terminalAccess === "restricted" && (
        <div className="animate-in duration-300 fade-in-0 slide-in-from-top-1">
          <StringListField
            id="allowed-commands"
            label="Commandes autorisées"
            required
            hint="Le nom du binaire uniquement, ex. git, npm, docker."
            placeholder="git"
            items={allowedCommands}
            onChange={(commands) =>
              updatePermissions({ allowedCommands: commands })
            }
            validate={isCommandNameValid}
            invalidHint="Un nom de commande, sans espace ni argument."
          />
        </div>
      )}
    </div>
  )
}
