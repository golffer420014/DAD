import { useDashboardStore } from '@/lib/store'
import { money } from '@/lib/format'
import { BET_TYPES } from '@/lib/bet-types'
import { ChartCard } from '@/components/shared/chart-card'

export function CategoryBreakdown() {
  const records = useDashboardStore((state) => state.records)

  const totals = BET_TYPES.map((type) => ({
    ...type,
    value: records.reduce((sum, row) => sum + row[type.key], 0),
  }))
  const max = Math.max(1, ...totals.map((t) => t.value))

  return (
    <ChartCard title="Value Summary" subtitle="มูลค่ารวมแยกตามประเภท">
      {records.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">ยังไม่มีข้อมูลให้แสดงผล</p>
      ) : (
        <div className="flex flex-col gap-4">
          {totals.map((type) => (
            <div key={type.key}>
              <div className="mb-1.5 flex items-baseline justify-between text-sm">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: type.color }} />
                  {type.name}
                </span>
                <span className="font-semibold">{money(type.value)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full" style={{ width: `${(type.value / max) * 100}%`, backgroundColor: type.color }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </ChartCard>
  )
}
