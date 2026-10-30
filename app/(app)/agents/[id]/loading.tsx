import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading the agent"
      className="flex animate-in flex-col gap-8 px-4 py-6 duration-500 fade-in-0 sm:px-6 lg:px-10 lg:py-8"
    >
      <Skeleton className="h-4 w-56" />

      <div className="flex items-start gap-4">
        <Skeleton className="size-12 shrink-0 rounded-xl sm:size-14" />
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-48 sm:h-9" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-9 w-32 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>

      <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-border/60 pt-6">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      <Separator className="mb-0" />

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <div className="flex gap-6 border-b border-border/60 pb-3">
            {[20, 24, 36, 18].map((width, i) => (
              <Skeleton key={i} className="h-4" style={{ width: `${width * 4}px` }} />
            ))}
          </div>
          {Array.from({ length: 3 }, (_, section) => (
            <div
              key={section}
              className="flex animate-in flex-col gap-4 fade-in-0 slide-in-from-bottom-2 [animation-fill-mode:both]"
              style={{ animationDelay: `${section * 90}ms` }}
            >
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-11/12" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col gap-6 lg:w-72 lg:shrink-0">
          {[5, 3, 2].map((rows, panel) => (
            <div key={panel} className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background-100 p-5">
              <Skeleton className="h-3 w-24" />
              {Array.from({ length: rows }, (_, row) => (
                <div key={row} className="flex items-center gap-4">
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-3.5 flex-1" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
