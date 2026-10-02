"use client"

import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { SelectInput } from "@/components/blocks/publish/fields/select-input"
import { StringListField } from "@/components/blocks/publish/fields/string-list-field"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { TERMINAL_ACCESS_OPTIONS } from "@/lib/publish/constants"
import { isCommandNameValid } from "@/lib/publish/validation"
import type { TerminalAccess } from "@/lib/publish/types"

export function TerminalAccessSelect() {
  const { data, updateSection } = usePublishWizard()
  const { terminal } = data.permissions

  return (
    <div className="flex flex-col gap-4">
      <FieldShell
        id="terminal-access"
        label="Terminal access"
        hint="Can the agent run shell commands on the machine?"
      >
        <SelectInput
          id="terminal-access"
          value={terminal.access}
          onChange={(value) =>
            updateSection("permissions", {
              terminal: { ...terminal, access: value as TerminalAccess },
            })
          }
          options={TERMINAL_ACCESS_OPTIONS.map((option) => ({
            value: option.id,
            label: option.label,
            description: option.description,
          }))}
        />
      </FieldShell>
      {terminal.access === "restricted" && (
        <div className="animate-in duration-300 fade-in-0 slide-in-from-top-1">
          <StringListField
            id="allowed-commands"
            label="Allowed commands"
            required
            hint="The binary name only, e.g. git, npm, docker."
            placeholder="git"
            items={terminal.commands}
            onChange={(commands) =>
              updateSection("permissions", {
                terminal: { ...terminal, commands },
              })
            }
            validate={isCommandNameValid}
            invalidHint="A command name, without spaces or arguments."
          />
        </div>
      )}
    </div>
  )
}
