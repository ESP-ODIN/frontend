"use client"

import { useEffect, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type StepTransitionProps = {
  stepKey: string
  children: ReactNode
}

export function StepTransition({ stepKey, children }: StepTransitionProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const frame = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [stepKey])

  return <div className={cn("fx-reveal", visible && "fx-in")}>{children}</div>
}
