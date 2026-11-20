import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading the creator"
      className="mx-auto flex max-w-7xl animate-in flex-col gap-8 px-4 py-6 duration-500 fade-in-0 sm:px-6 lg:px-10 lg:py-8"
    >
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 shrink-0 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-40" />
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-44" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
