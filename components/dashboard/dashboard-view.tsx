"use client"

import { useMemo, useState } from "react"
import { Boxes, Download, ThumbsUp, TriangleAlert } from "lucide-react"

import {
  bucket,
  likeShare,
  mergeDaily,
  relativeChange,
  sliceRange,
  sumBy,
} from "@/lib/dashboard/analytics"
import { MOCK_NOTES } from "@/lib/dashboard/mock"
import { RANGE_OPTIONS, type AgentAnalytics, type CreatorDashboardData, type DailyMetric, type RangeDays } from "@/lib/dashboard/types"
import { cn } from "@/lib/utils"
import { SelectInput } from "@/components/publish/fields/select-input"
import { ChartCard } from "@/components/dashboard/chart-card"
import { LineChart } from "@/components/dashboard/charts/line-chart"
import { StackedColumns } from "@/components/dashboard/charts/stacked-columns"
import { formatNumber, type ChartSeries } from "@/components/dashboard/charts/chart-types"
import { StatTile } from "@/components/dashboard/stat-tile"
import { LikesPanel } from "@/components/dashboard/likes-panel"
import { ErrorsTable } from "@/components/dashboard/errors-table"
import { AgentsTable } from "@/components/dashboard/agents-table"

/** Ordre fixe des couleurs (validé daltonisme + contraste), jamais recyclé. */
const SERIES_COLORS = ["var(--viz-1)", "var(--viz-2)", "var(--viz-3)", "var(--viz-4)"]
const OTHER_COLOR = "var(--viz-other)"
const ALL_AGENTS = "all"
const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Couleur de chaque agent, attribuée une fois pour toutes dans l'ordre de la liste : filtrer ne
 * repeint pas les autres. Au-delà de 4 agents, les 3 premiers gardent leur couleur et le reste
 * est regroupé dans "Other".
 */
function assignColors(analytics: AgentAnalytics[]): Record<string, string> {
  const folded = analytics.length > SERIES_COLORS.length
  return Object.fromEntries(
    analytics.map(({ agent }, i) => [
      agent.id,
      folded && i >= SERIES_COLORS.length - 1 ? OTHER_COLOR : SERIES_COLORS[i],
    ])
  )
}

function buildSeries(
  selected: AgentAnalytics[],
  all: AgentAnalytics[],
  colors: Record<string, string>,
  days: number,
  key: DailyMetric
): ChartSeries[] {
  const values = (item: AgentAnalytics) => sliceRange(item.daily, days).map((day) => day[key])
  const folded = selected.length > 1 && all.length > SERIES_COLORS.length

  if (!folded) {
    return selected.map((item) => ({ id: item.agent.id, label: item.agent.name, color: colors[item.agent.id], values: values(item) }))
  }

  const kept = selected.slice(0, SERIES_COLORS.length - 1)
  const rest = selected.slice(SERIES_COLORS.length - 1)
  const other = values(rest[0]).map((_, i) => rest.reduce((sum, item) => sum + values(item)[i], 0))
  return [
    ...kept.map((item) => ({ id: item.agent.id, label: item.agent.name, color: colors[item.agent.id], values: values(item) })),
    { id: "other", label: `Other (${rest.length})`, color: OTHER_COLOR, values: other },
  ]
}

type DashboardViewProps = {
  data: CreatorDashboardData
}

export function DashboardView({ data }: DashboardViewProps) {
  const [days, setDays] = useState<RangeDays>(30)
  const [agentId, setAgentId] = useState(ALL_AGENTS)

  const colors = useMemo(() => assignColors(data.analytics), [data.analytics])
  const agentNames = useMemo(
    () => Object.fromEntries(data.analytics.map(({ agent }) => [agent.id, agent.name])),
    [data.analytics]
  )

  const selected = agentId === ALL_AGENTS ? data.analytics : data.analytics.filter((item) => item.agent.id === agentId)
  const merged = mergeDaily(selected)
  const current = sliceRange(merged, days)
  const previous = sliceRange(merged, days, true)
  const dates = current.map((day) => day.date)

  const installs = sumBy(current, "installs")
  const errors = sumBy(current, "errors")
  const likes = sumBy(current, "likes")
  const share = likeShare(likes, sumBy(current, "dislikes"))
  const secureCount = selected.filter(({ agent }) => agent.secure).length
  const periodLabel = `previous ${days} days`

  const installSeries = buildSeries(selected, data.analytics, colors, days, "installs")
  const errorSeries = buildSeries(selected, data.analytics, colors, days, "errors")

  const since = data.generatedAt - days * DAY_MS
  const visibleErrors = data.errors.filter(
    (error) => (agentId === ALL_AGENTS || error.agentId === agentId) && Date.parse(error.lastSeen) >= since
  )

  const agentOptions = [
    { value: ALL_AGENTS, label: "All agents" },
    ...data.analytics.map(({ agent }) => ({ value: agent.id, label: agent.name })),
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Filtres : une seule ligne, au-dessus de tout ce qu'ils filtrent. */}
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Date range" className="flex rounded-xl border border-muted/40 bg-background-100 p-1 text-sm">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.days}
              type="button"
              aria-pressed={days === option.days}
              onClick={() => setDays(option.days)}
              className={cn(
                "rounded-lg px-3 py-1.5 transition-colors",
                days === option.days ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="hidden sm:inline">Last </span>
              {option.label}
            </button>
          ))}
        </div>
        {data.analytics.length > 1 && (
          <SelectInput id="dashboard-agent" value={agentId} onChange={(value) => setAgentId(value || ALL_AGENTS)} options={agentOptions} className="w-56" />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={Download}
          label="Installs"
          value={formatNumber(installs)}
          change={relativeChange(installs, sumBy(previous, "installs"))}
          periodLabel={periodLabel}
          trend={bucket(current.map((day) => day.installs), 12)}
          devMark={{ kind: "mock", note: MOCK_NOTES.installs }}
        />
        <StatTile
          icon={ThumbsUp}
          label="Likes"
          value={formatNumber(likes)}
          change={relativeChange(likes, sumBy(previous, "likes"))}
          periodLabel={periodLabel}
          trend={bucket(current.map((day) => day.likes), 12)}
          hint={share === null ? undefined : `${Math.round(share * 100)}% liked`}
          devMark={{ kind: "mock", note: MOCK_NOTES.likes }}
        />
        <StatTile
          icon={TriangleAlert}
          label="Errors reported"
          value={formatNumber(errors)}
          change={relativeChange(errors, sumBy(previous, "errors"))}
          upIsGood={false}
          periodLabel={periodLabel}
          trend={bucket(current.map((day) => day.errors), 12)}
          devMark={{ kind: "mock", note: MOCK_NOTES.errors }}
        />
        <StatTile
          icon={Boxes}
          label="Published agents"
          value={formatNumber(selected.length)}
          hint={`${secureCount} of ${selected.length} security verified`}
        />
      </div>

      <ChartCard
        title="Installs over time"
        description={`Daily installs over the last ${days} days.`}
        mockNote={MOCK_NOTES.installs}
        series={installSeries}
        dates={dates}
        legendShape="line"
      >
        <LineChart dates={dates} series={installSeries} ariaLabel={`Daily installs over the last ${days} days`} />
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <ChartCard
          title="Errors over time"
          description={`Errors reported each day, by agent.`}
          mockNote={MOCK_NOTES.errors}
          series={errorSeries}
          dates={dates}
          legendShape="rect"
        >
          <StackedColumns dates={dates} series={errorSeries} ariaLabel={`Errors reported each day over the last ${days} days`} />
        </ChartCard>
        <LikesPanel analytics={selected} rangeDays={days} colors={colors} />
      </div>

      <ErrorsTable errors={visibleErrors} agentNames={agentNames} />
      <AgentsTable analytics={selected} rangeDays={days} colors={colors} />
    </div>
  )
}
