import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-mono tracking-wide",
  {
    variants: {
      variant: {
        outline: "border border-muted/40 text-muted-foreground",
        primary: "bg-primary/10 font-bold text-primary",
        inverted: "bg-foreground font-bold text-background",
        muted: "bg-muted/15 font-bold text-muted-foreground",
      },
      size: {
        default: "px-2.5 py-1 text-[11px] uppercase",
        sm: "px-2 py-0.5 text-[10px]",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  }
)

type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size, className }))} {...props} />
}

export { badgeVariants }
