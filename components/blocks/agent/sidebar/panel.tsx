type AgentSidebarPanelProps = {
  title: string
  children: React.ReactNode
}

export function AgentSidebarPanel({ title, children }: AgentSidebarPanelProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background-100 p-5 transition-colors hover:border-primary/25">
      <p className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
        {title}
      </p>
      {children}
    </div>
  )
}
