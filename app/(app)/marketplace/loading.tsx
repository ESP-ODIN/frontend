import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { AuroraBackground } from "@/components/motion/aurora-background"

export default function Loading() {
  return (
    <div role="status" aria-label="Loading the marketplace" className="animate-in fade-in-0 duration-500">
      <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
        <div className="flex flex-col gap-5">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-12 w-72 sm:h-14 sm:w-96" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex justify-center gap-8 lg:justify-start">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 lg:items-start">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="mt-10 flex flex-col gap-10 lg:flex-row">
        <div className="hidden w-56 flex-col gap-5 lg:flex">
          <Skeleton className="h-4 w-16" />
          {Array.from({ length: 3 }, (_, section) => (
            <div key={section} className="flex flex-col gap-3 border-b border-border/60 pb-5">
              <Skeleton className="h-4 w-20" />
              {Array.from({ length: 3 }, (_, row) => (
                <div key={row} className="flex items-center gap-2.5">
                  <Skeleton className="size-4 rounded-[5px]" />
                  <Skeleton className="h-3.5 flex-1" />
                  <Skeleton className="h-4 w-6 rounded-full" />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex min-w-0 flex-2 flex-col gap-6 sm:gap-8">
          <div className="relative h-56 overflow-hidden rounded-2xl bg-[#14110C] p-6 lg:p-8">
            <AuroraBackground className="opacity-60" />
            <div className="relative flex flex-col gap-4">
              <Skeleton className="h-4 w-40 bg-white/10" />
              <Skeleton className="h-8 w-64 bg-white/10" />
              <Skeleton className="h-4 w-full max-w-md bg-white/10" />
              <div className="mt-2 flex gap-2">
                <Skeleton className="h-9 w-24 rounded-lg bg-white/10" />
                <Skeleton className="h-9 w-28 rounded-lg bg-white/10" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-4 w-28" />
          </div>

          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="flex animate-in flex-col gap-4 rounded-xl border border-muted/40 bg-background-100 p-6 fade-in-0 slide-in-from-bottom-2 [animation-fill-mode:both]"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-11 rounded-lg" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-4/5" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-muted/40 pt-4">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3.5 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
