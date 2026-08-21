import { Check } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'

export function DataQualityBanner() {
  const totalRecords = useDashboardStore((state) => state.records.length)

  return (
    <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4 text-sm">
      <div className="flex items-center gap-2 font-medium">
        <Check className="size-4 text-emerald-500" /> Data Quality
      </div>
      <span className="text-muted-foreground">{totalRecords.toLocaleString()} records พร้อมใช้งาน</span>
      <span className="text-muted-foreground">ข้อมูลจากไฟล์ที่นำเข้าจริง</span>
    </div>
  )
}
