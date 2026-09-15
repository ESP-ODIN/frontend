"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cva } from "class-variance-authority"
import { cn } from "cn"

const separatorVariants = cva("shrink-0 bg-muted/30", {
  variants: {
    orientation: {
      horizontal: "h-px w-full mb-10",
      vertical: "w-px self-stretch",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(separatorVariants({ orientation }), className)}
      {...props}
    />
  )
}

export { Separator, separatorVariants }
