import { Settings2, ShieldAlert } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RiskLimitField } from '@/components/settings/risk-limit-field'

export function RiskLimitDialog() {
  const riskLimits = useDashboardStore((state) => state.riskLimits)
  const setRiskLimits = useDashboardStore((state) => state.setRiskLimits)

  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
        <Settings2 className="size-3.5" /> ตั้งค่า
      </DialogTrigger>
      <DialogContent>
        <div className="mb-4 flex items-center gap-2">
          <ShieldAlert className="size-4 text-amber-600" />
          <DialogTitle>เพดานยอดสำหรับแนะนำการกั๊ก</DialogTitle>
        </div>
        <DialogDescription className="mb-4">
          เลขที่ยอดต่ำกว่าเพดานทุกประเภทจะถูกแนะนำให้ "กั๊ก" ไว้เอง ส่วนเลขที่เกินเพดานจะถูกแนะนำให้ส่งต่อขึ้นสายบน — ตั้งแยกตามประเภทการซื้อ เพราะแต่ละประเภทมักรับความเสี่ยงได้ไม่เท่ากัน ใส่ 0 หากไม่ต้องการให้ประเภทนั้นมีผลต่อคำแนะนำ
        </DialogDescription>
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
      </DialogContent>
    </Dialog>
  )
}
