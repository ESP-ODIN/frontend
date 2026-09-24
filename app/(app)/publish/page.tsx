import type { Metadata } from "next"

import { PublishWizard } from "@/components/blocks/publish/publish-wizard"
import { DRAFT_PARAM, parseDraft } from "@/lib/publish/url-state"

export const metadata: Metadata = {
  title: "Publier un agent — Odin",
  description: "Publiez votre agent sur le marketplace Odin en quatre étapes.",
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const draftParam = (await searchParams)[DRAFT_PARAM]
  // Restoring server-side means the first render already shows the saved draft — no flash, no hydration mismatch.
  const initialDraft = parseDraft(
    typeof draftParam === "string" ? draftParam : null
  )

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Publier un agent
        </h1>
        <p className="mt-2 text-muted-foreground">
          Partagez votre agent avec la communauté Odin en renseignant son
          manifeste et ses permissions.
        </p>
      </div>
      <PublishWizard initialDraft={initialDraft} />
    </div>
  )
}
