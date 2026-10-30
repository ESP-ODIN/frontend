"use client"

import { useEffect } from "react"
import Link from "next/link"
import { House, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/motion/magnetic"
import { StatusScreen } from "@/components/blocks/status/status-screen"

type ErrorScreenProps = {
  error: Error & { digest?: string }
  retry: () => void
  className?: string
}

export function ErrorScreen({ error, retry, className }: ErrorScreenProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <StatusScreen
      className={className}
      code="500"
      tone="danger"
      eyebrow="Something broke"
      title={
        <>
          The registry <span className="fx-gradient-text">didn&apos;t answer</span>.
        </>
      }
      description="A service Odin depends on is unreachable or returned an error. It's usually temporary, try again in a moment."
      lines={[
        { kind: "command", text: "odin registry ping" },
        { kind: "output", text: "contacting marketplace…" },
        { kind: "error", text: error.digest ? `request failed · digest ${error.digest}` : "request failed" },
        { kind: "output", text: "retry suggested" },
      ]}
      actions={
        <>
          <Magnetic>
            <Button className="fx-shine h-11 rounded-full px-6" icon={RotateCcw} onClick={() => retry()}>
              Try again
            </Button>
          </Magnetic>
          <Button
            variant="outline"
            className="h-11 rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
            icon={House}
            render={<Link href="/" />}
          >
            Back home
          </Button>
        </>
      }
    />
  )
}
