import { StatsGrid } from '@/components/triage/stats-grid'
import { FileBadges } from '@/components/triage/file-badges'
import { TriageTable } from '@/components/triage/triage-table'
import { RiskLimitDialog } from '@/components/settings/risk-limit-dialog'

export function TriageView() {
  return (
    <div className="flex h-full min-h-0 flex-col animate-in fade-in duration-500">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <h1 className="text-xl font-semibold tracking-tight">คัดกรอง</h1>
          <FileBadges />
          <RiskLimitDialog />
        </div>
        <StatsGrid />
      </div>

      <TriageTable />
    </div>
  )
}
