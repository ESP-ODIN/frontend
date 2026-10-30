"use client"

import { ErrorScreen } from "@/components/blocks/status/error-screen"

// Root boundary: landing and auth pages (they have no shared nav layout)
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="pt-6">
      <ErrorScreen error={error} retry={retry} />
    </main>
  )
}
