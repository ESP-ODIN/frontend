import { cn } from "@/lib/utils"

function Bar({ className }: { className?: string }) {
  return <div className={cn("fx-skeleton rounded-md bg-muted/15", className)} />
}

export function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      aria-busy
      aria-label="Loading the feed"
      className="flex flex-col gap-4"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex animate-in flex-col gap-4 rounded-2xl border border-muted/30 bg-background-100 p-5 fade-in-0 fill-mode-both"
          style={{ animationDelay: `${i * 90}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className="fx-skeleton size-10 rounded-full bg-muted/15" />
            <div className="flex flex-1 flex-col gap-2">
              <Bar className="h-3 w-32" />
              <Bar className="h-2.5 w-20" />
            </div>
            <Bar className="h-5 w-16 rounded-full" />
          </div>
          <Bar className="h-4 w-3/4" />
          <div className="flex flex-col gap-2">
            <Bar className="h-3 w-full" />
            <Bar className="h-3 w-11/12" />
            <Bar className="h-3 w-2/3" />
          </div>
          <div className="flex gap-2">
            <Bar className="h-5 w-14 rounded-full" />
            <Bar className="h-5 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
