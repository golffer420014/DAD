import { ShieldCheck, Sparkles } from 'lucide-react'
import { UploadArea } from '@/components/dashboard/upload-area'
import { StatsGrid } from '@/components/dashboard/stats-grid'
import { TopNumbersChart } from '@/components/dashboard/top-numbers-chart'
import { CategoryBreakdown } from '@/components/dashboard/category-breakdown'
import { ValueByFileChart } from '@/components/dashboard/value-by-file-chart'
import { NumbersTable } from '@/components/dashboard/numbers-table'
import { DataQualityBanner } from '@/components/dashboard/data-quality-banner'

export function DashboardView() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="size-3.5" /> Analytics workspace
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">แดชบอร์ด</h1>
          <p className="mt-2 text-sm text-muted-foreground">วิเคราะห์และสรุปข้อมูลจากไฟล์ Excel ที่นำเข้า</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-emerald-500" /> ประมวลผลภายในเครื่อง
        </div>
      </div>

      <UploadArea />
      <StatsGrid />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <TopNumbersChart />
        <div className="flex flex-col gap-6">
          <CategoryBreakdown />
          <ValueByFileChart />
        </div>
      </div>

      <NumbersTable />
      <DataQualityBanner />
    </div>
  )
}
