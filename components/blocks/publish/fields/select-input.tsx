"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type SelectInputOption = {
  value: string
  label: string
  description?: string
}

type SelectInputProps = {
  id: string
  value: string
  onChange: (value: string) => void
  options: SelectInputOption[]
  placeholder?: string
  className?: string
}

export function SelectInput({
  id,
  value,
  onChange,
  options,
  placeholder,
  className,
}: SelectInputProps) {
  return (
    <Select<string>
      id={id}
      value={value || null}
      onValueChange={(next) => onChange(next ?? "")}
      items={options.map((option) => ({
        value: option.value,
        label: option.label,
      }))}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex flex-col gap-0.5">
              <SelectItemText>{option.label}</SelectItemText>
              {option.description && (
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
