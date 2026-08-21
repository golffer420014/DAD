import { Activity, BarChart3, Database, Files } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'
import { aggregateByNumber, money } from '@/lib/format'
import { StatCard } from '@/components/dashboard/stat-card'

export function StatsGrid() {
  const files = useDashboardStore((state) => state.files)
  const records = useDashboardStore((state) => state.records)

  const numbers = aggregateByNumber(records)
  const totalRecords = records.length
  const totalValue = records.reduce((sum, row) => sum + row.top + row.bottom + row.tod, 0)

  const stats = [
    { label: 'ไฟล์ทั้งหมด', value: files.length.toString(), icon: Files },
    { label: 'จำนวนรายการ', value: totalRecords.toLocaleString(), icon: Activity },
    { label: 'มูลค่ารวม', value: money(totalValue), icon: BarChart3 },
    { label: 'เลขไม่ซ้ำ', value: numbers.length.toLocaleString(), icon: Database },
  ]

  return (
    <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  )
}
