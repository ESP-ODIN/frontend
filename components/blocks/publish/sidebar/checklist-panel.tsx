"use client"

import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { usePublishWizard } from "@/components/blocks/publish/wizard-context"
import { getChecklistItems } from "@/lib/publish/validation"

export function ChecklistPanel() {
  const { data, nameCheckStatus } = usePublishWizard()
  const items = getChecklistItems(data, nameCheckStatus)

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-muted/40 bg-background-100 p-5">
      <p className="text-sm font-bold text-foreground">Checklist</p>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2.5 text-sm">
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                item.done
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted/40 text-transparent"
              )}
            >
              {item.done && <Check className="fx-pop size-3" strokeWidth={3} />}
            </span>
            <span
              className={cn(
                "transition-colors duration-300",
                item.done ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
