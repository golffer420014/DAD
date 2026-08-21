import { ShieldAlert } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'
import { RiskLimitField } from '@/components/settings/risk-limit-field'

export function SettingsView() {
  const riskLimits = useDashboardStore((state) => state.riskLimits)
  const setRiskLimits = useDashboardStore((state) => state.setRiskLimits)

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Risk management</p>
        <h1 className="text-3xl font-semibold tracking-tight">ตั้งค่า</h1>
        <p className="mt-2 text-sm text-muted-foreground">กำหนดเพดานยอดรับต่อเลข เมื่อยอดรวมของเลขใดเกินเพดาน ระบบจะไฮไลต์เตือนในหน้าแดชบอร์ดทันที</p>
      </div>

      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <ShieldAlert className="size-4 text-amber-600" />
          <h2 className="font-semibold tracking-tight">เพดานความเสี่ยงต่อเลข</h2>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          ตั้งแยกตามประเภทการซื้อ เพราะแต่ละประเภทมักรับความเสี่ยงได้ไม่เท่ากัน — ใส่ 0 หากไม่ต้องการจำกัดประเภทนั้น
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
