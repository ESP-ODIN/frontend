"use client"

import { ErrorScreen } from "@/components/status/error-screen"

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="pt-6">
      <ErrorScreen error={error} retry={retry} />
    </main>
  )
}
