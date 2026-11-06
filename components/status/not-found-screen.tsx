import Link from "next/link"
import { ArrowLeft, Store } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/motion/magnetic"
import { StatusScreen, type StatusLine } from "@/components/status/status-screen"

type NotFoundScreenProps = {
  eyebrow?: string
  title?: React.ReactNode
  description?: string
  lines?: StatusLine[]
  className?: string
}

const defaultLines: StatusLine[] = [
  { kind: "command", text: "odin open ./this-page" },
  { kind: "output", text: "resolving route…" },
  { kind: "error", text: "404 · nothing published here" },
]

export function NotFoundScreen({
  eyebrow = "Page not found",
  title = (
    <>
      This page <span className="fx-gradient-text">wandered off</span>.
    </>
  ),
  description = "The link may be broken, or the page was moved or never existed. The marketplace is a good place to start again.",
  lines = defaultLines,
  className,
}: NotFoundScreenProps) {
  return (
    <StatusScreen
      className={className}
      code="404"
      eyebrow={eyebrow}
      title={title}
      description={description}
      lines={lines}
      actions={
        <>
          <Magnetic>
            <Button className="fx-shine h-11 rounded-full px-6" icon={Store} render={<Link href="/marketplace" />}>
              Browse the store
            </Button>
          </Magnetic>
          <Button
            variant="outline"
            className="h-11 rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
            icon={ArrowLeft}
            render={<Link href="/" />}
          >
            Back home
          </Button>
        </>
      }
    />
  )
}
