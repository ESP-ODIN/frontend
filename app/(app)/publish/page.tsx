import type { Metadata } from "next"

import { PublishWizard } from "@/components/blocks/publish/publish-wizard"
import { DRAFT_PARAM, parseDraft } from "@/lib/publish/url-state"

export const metadata: Metadata = {
  title: "Publish an agent — Odin",
  description: "Publish your agent on the Odin marketplace in five steps.",
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const draftParam = (await searchParams)[DRAFT_PARAM]
  const initialDraft = parseDraft(
    typeof draftParam === "string" ? draftParam : null
  )

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Publish an agent
        </h1>
        <p className="mt-2 text-muted-foreground">
          Share your agent with the Odin community by filling in its manifest
          and permissions.
        </p>
      </div>
      <PublishWizard initialDraft={initialDraft} />
    </div>
  )
}
