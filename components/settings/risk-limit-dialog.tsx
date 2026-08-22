import { ShieldAlert } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'
import { RiskLimitField } from '@/components/settings/risk-limit-field'

export function SettingsView() {
  const riskLimits = useDashboardStore((state) => state.riskLimits)
  const setRiskLimits = useDashboardStore((state) => state.setRiskLimits)

  return (
    <div className="h-full min-h-0 overflow-y-auto animate-in fade-in duration-500">
      <h1 className="mb-3 text-xl font-semibold tracking-tight">ตั้งค่า</h1>

      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <ShieldAlert className="size-4 text-amber-600" />
          <h2 className="font-semibold tracking-tight">เพดานยอดสำหรับแนะนำการกั๊ก</h2>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          เลขที่ยอดต่ำกว่าเพดานทุกประเภทจะถูกแนะนำให้ "กั๊ก" ไว้เอง ส่วนเลขที่เกินเพดานจะถูกแนะนำให้ส่งต่อขึ้นสายบน — ตั้งแยกตามประเภทการซื้อ เพราะแต่ละประเภทมักรับความเสี่ยงได้ไม่เท่ากัน ใส่ 0 หากไม่ต้องการให้ประเภทนั้นมีผลต่อคำแนะนำ
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <RiskLimitField
            label="บน"
            hint="เพดานยอดรวมต่อเลข (บน)"
            value={riskLimits.top}
            onChange={(top) => setRiskLimits({ ...riskLimits, top })}
          />
          <RiskLimitField
            label="ล่าง"
            hint="เพดานยอดรวมต่อเลข (ล่าง)"
            value={riskLimits.bottom}
            onChange={(bottom) => setRiskLimits({ ...riskLimits, bottom })}
          />
          <RiskLimitField
            label="โต๊ด"
            hint="เพดานยอดรวมต่อเลข (โต๊ด)"
            value={riskLimits.tod}
            onChange={(tod) => setRiskLimits({ ...riskLimits, tod })}
          />
        </div>
      </section>
    </div>
  )
}
