"use client"

import { ErrorScreen } from "@/components/blocks/status/error-screen"

// Sits under the (app) layout, so the floating nav stays usable while the page failed
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorScreen error={error} retry={retry} />
}
