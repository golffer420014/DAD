import { StatsGrid } from '@/components/triage/stats-grid'
import { DataQualityBanner } from '@/components/triage/data-quality-banner'
import { TriageTable } from '@/components/triage/triage-table'

export function TriageView() {
  return (
    <div className="flex h-full min-h-0 flex-col animate-in fade-in duration-500">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h1 className="mb-3 text-xl font-semibold tracking-tight">คัดกรอง</h1>
        <StatsGrid />
      </div>

      <DataQualityBanner />
      <TriageTable />
    </div>
  )
}
