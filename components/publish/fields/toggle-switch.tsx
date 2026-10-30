import { cn } from "@/lib/utils"

type ToggleSwitchProps = {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function ToggleSwitch({
  id,
  checked,
  onChange,
  label,
}: ToggleSwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300",
        checked ? "border-primary bg-primary" : "border-muted/40 bg-muted/20"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-5 rounded-full bg-background shadow transition-transform duration-300",
          checked && "translate-x-5"
        )}
      />
    </button>
  )
}
