"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FieldShell } from "@/components/blocks/publish/fields/field-shell"

type StringListFieldProps = {
  id: string
  label: string
  hint?: string
  required?: boolean
  placeholder?: string
  items: string[]
  onChange: (items: string[]) => void
  validate?: (value: string) => boolean
  invalidHint?: string
}

export function StringListField({
  id,
  label,
  hint,
  required,
  placeholder,
  items,
  onChange,
  validate,
  invalidHint,
}: StringListFieldProps) {
  const [draft, setDraft] = useState("")
  const isInvalid = draft.length > 0 && validate ? !validate(draft) : false

  function addItem() {
    const trimmed = draft.trim()
    if (!trimmed || (validate && !validate(trimmed))) return
    onChange([...items, trimmed])
    setDraft("")
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={isInvalid ? undefined : hint}
      error={isInvalid ? invalidHint : undefined}
    >
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              addItem()
            }
          }}
          placeholder={placeholder}
          className="font-mono"
          aria-invalid={isInvalid}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          icon={Plus}
          onClick={addItem}
          aria-label="Ajouter"
        />
      </div>
      {items.length > 0 && (
        <ul className="flex flex-col gap-1.5 pt-1">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className={cn(
                "fx-pop flex items-center justify-between gap-2 rounded-lg border border-muted/40 bg-background-100 px-3 py-1.5 font-mono text-xs text-foreground"
              )}
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem(index)}
                aria-label={`Retirer ${item}`}
              >
                <X className="size-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </FieldShell>
  )
}
