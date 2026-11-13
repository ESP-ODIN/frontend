import { Star } from "lucide-react"

import { averageRating, ratingCount } from "@/lib/dashboard/analytics"
import { MOCK_NOTES } from "@/lib/dashboard/mock"
import type { RatingDistribution } from "@/lib/dashboard/types"
import { formatNumber } from "@/components/dashboard/charts/chart-types"
import { DevMark } from "@/components/dev/dev-mark"

type RatingsPanelProps = {
  ratings: RatingDistribution
}

/** Répartition des notes de 5 à 1 étoile : barres fines, part et nombre en clair à droite. */
export function RatingsPanel({ ratings }: RatingsPanelProps) {
  const total = ratingCount(ratings)
  const average = averageRating(ratings)
  const max = Math.max(1, ...ratings)

  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-2xl border border-muted/40 bg-background-100 p-5">
      <div>
        <h2 className="flex items-center gap-2 font-semibold text-foreground">
          Ratings <DevMark kind="mock" note={MOCK_NOTES.ratings} />
        </h2>
        <p className="text-sm text-muted-foreground">What users think of your agents, all time.</p>
      </div>

      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-semibold text-foreground">{average === null ? "—" : average.toFixed(1)}</p>
        <p className="text-sm text-muted-foreground">/ 5 · {formatNumber(total)} ratings</p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {[4, 3, 2, 1, 0].map((i) => {
          const share = total === 0 ? 0 : ratings[i] / total
          return (
            <li key={i} className="grid grid-cols-[2.5rem_1fr_4.5rem] items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground tabular-nums">
                {i + 1}
                <Star aria-hidden className="size-3 fill-current" />
                <span className="sr-only">stars</span>
              </span>
              <span className="h-2 overflow-hidden rounded-full bg-muted/15">
                <span
                  className="block h-full rounded-full bg-foreground/70"
                  style={{ width: `${(ratings[i] / max) * 100}%` }}
                />
              </span>
              <span className="text-right text-muted-foreground tabular-nums">
                <span className="text-foreground">{Math.round(share * 100)}%</span> · {formatNumber(ratings[i])}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
