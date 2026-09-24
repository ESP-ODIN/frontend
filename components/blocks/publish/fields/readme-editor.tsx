"use client"

import { useState } from "react"
import { BookOpen, Eye, FileCode2, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { FieldShell } from "@/components/blocks/publish/fields/field-shell"
import { TextAreaBase } from "@/components/blocks/publish/fields/text-area-base"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { MarkdownPreview } from "@/components/blocks/markdown-preview"

function ModeButton({
  icon: Icon,
  active,
  onClick,
  label,
}: {
  icon: LucideIcon
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="size-3" />
      {label}
    </button>
  )
}

export function ReadmeEditor() {
  const { data, updateManifest } = usePublishWizard()
  const [mode, setMode] = useState<"edit" | "preview">("edit")
  const readme = data.manifest.readme

  return (
    <FieldShell
      id="readme"
      label="README"
      hint="Alimente la fiche agent finale. Markdown supporté."
      trailing={
        <div className="flex gap-1 rounded-full border border-muted/40 p-0.5">
          <ModeButton
            icon={FileCode2}
            active={mode === "edit"}
            onClick={() => setMode("edit")}
            label="Éditer"
          />
          <ModeButton
            icon={Eye}
            active={mode === "preview"}
            onClick={() => setMode("preview")}
            label="Aperçu"
          />
        </div>
      }
    >
      {mode === "edit" ? (
        <TextAreaBase
          id="readme"
          value={readme}
          onChange={(event) => updateManifest({ readme: event.target.value })}
          placeholder={"# Mon agent\n\nDécrivez ce que fait votre agent..."}
          className="min-h-48 font-mono text-xs"
        />
      ) : (
        <div className="min-h-48 overflow-hidden rounded-2xl border border-muted/40 bg-background-100">
          <div className="flex items-center gap-2 border-b border-muted/40 px-4 py-2 font-mono text-xs text-muted-foreground">
            <BookOpen className="size-3.5" />
            README.md
          </div>
          {readme.trim() ? (
            <MarkdownPreview source={readme} className="px-5 py-4" />
          ) : (
            <p className="px-5 py-4 text-sm text-muted-foreground">
              Rien à prévisualiser.
            </p>
          )}
        </div>
      )}
    </FieldShell>
  )
}
