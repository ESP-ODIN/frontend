import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div aria-hidden data-slot="skeleton" className={cn("fx-skeleton rounded-md bg-muted/15", className)} {...props} />
}

export { Skeleton }
