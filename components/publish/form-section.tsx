import type { ReactNode } from "react"

type FormSectionProps = {
  title: string
  table?: string
  description?: string
  children: ReactNode
}

export function FormSection({
  title,
  table,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-muted/40 p-5">
      <header className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-heading text-base font-bold text-foreground">
            {title}
          </h3>
          {table && (
            <code className="rounded-md bg-muted/15 px-2 py-0.5 font-mono text-xs text-muted-foreground">
              [{table}]
            </code>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </header>
      {children}
    </section>
  )
}
