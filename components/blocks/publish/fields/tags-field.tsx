"use client"

import { useState } from "react"
import { X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/blocks/badge"
import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { MAX_TAGS } from "@/lib/publish/constants"

export function TagsField() {
  const { data, updateSection } = usePublishWizard()
  const [draft, setDraft] = useState("")
  const tags = data.package.tags
  const isFull = tags.length >= MAX_TAGS

  function commitDraft(raw: string) {
    const newTags = raw
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    if (newTags.length === 0) return
    updateSection("package", {
      tags: Array.from(new Set([...tags, ...newTags])).slice(0, MAX_TAGS),
    })
  }

  function handleChange(value: string) {
    if (value.includes(",")) {
      commitDraft(value)
      setDraft("")
      return
    }
    setDraft(value)
  }

  function removeTag(tag: string) {
    updateSection("package", { tags: tags.filter((item) => item !== tag) })
  }

  return (
    <FieldShell
      id="tags"
      label="Tags"
      hint={
        isFull
          ? `Maximum ${MAX_TAGS} tags: remove one to add another.`
          : "Separate tags with a comma."
      }
      trailing={
        <span className="font-mono text-xs text-muted-foreground">
          {tags.length}/{MAX_TAGS}
        </span>
      }
    >
      <Input
        id="tags"
        value={draft}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={() => {
          commitDraft(draft)
          setDraft("")
        }}
        placeholder={isFull ? "Limit reached" : "cli, automation, github"}
        disabled={isFull}
      />
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="muted" className="fx-pop gap-1 pr-1.5">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Retirer ${tag}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </FieldShell>
  )
}
