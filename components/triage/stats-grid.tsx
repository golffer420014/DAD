import { useDashboardStore } from '@/lib/store'
import { aggregateByNumber, money } from '@/lib/format'

export function StatsGrid() {
  const files = useDashboardStore((state) => state.files)
  const records = useDashboardStore((state) => state.records)

  const numbers = aggregateByNumber(records)
  const totalValue = records.reduce((sum, row) => sum + row.top + row.bottom + row.tod, 0)

  const stats = [
    { label: 'ไฟล์', value: files.length.toLocaleString() },
    { label: 'รายการ', value: records.length.toLocaleString() },
    { label: 'มูลค่ารวม', value: money(totalValue) },
    { label: 'เลขไม่ซ้ำ', value: numbers.length.toLocaleString() },
  ]

  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {stats.map((stat) => (
        <span key={stat.label}>
          <span className="font-semibold text-foreground">{stat.value}</span> {stat.label}
        </span>
      ))}
    </div>
  )
}
