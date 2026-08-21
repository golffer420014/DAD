import { Database, Files, ListFilter, Settings2, SplitSquareVertical } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'
import type { View } from '@/lib/types'

const NAV_ITEMS: [View, typeof ListFilter, string][] = [
  ['triage', ListFilter, 'คัดกรอง'],
  ['explorer', Database, 'ข้อมูลดิบ'],
  ['files', Files, 'ไฟล์ที่นำเข้า'],
]

const SETTINGS_ITEM: [View, typeof Settings2, string] = ['settings', Settings2, 'ตั้งค่า']

export function AppSidebar() {
  const view = useDashboardStore((state) => state.view)
  const mobileNav = useDashboardStore((state) => state.mobileNav)
  const setView = useDashboardStore((state) => state.setView)
  const setMobileNav = useDashboardStore((state) => state.setMobileNav)

  return (
    <>
      {mobileNav && <div className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileNav(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-sidebar p-4 transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
          <SplitSquareVertical className="size-5" />
        </div>
        <div>
          <p className="font-semibold tracking-tight">จัดการโพย</p>
          <p className="text-xs text-muted-foreground">รวมยอด → กั๊ก → ส่งต่อ</p>
        </div>
      </div>
      <nav className="mt-8 flex flex-col gap-1 text-sm">
        {NAV_ITEMS.map(([key, Icon, label]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${view === key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
          >
            <Icon className="size-4" />
            <span>{label}</span>
          </button>
        ))}
        <button
          onClick={() => setView(SETTINGS_ITEM[0])}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${view === SETTINGS_ITEM[0] ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
        >
          <Settings2 className="size-4" />
          <span>{SETTINGS_ITEM[2]}</span>
        </button>
      </nav>
      <div className="mt-auto rounded-xl border bg-card p-3">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="size-2 rounded-full bg-emerald-500" /> Local processing
        </div>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">ไฟล์ของคุณจะถูกประมวลผลภายในเบราว์เซอร์</p>
      </div>
      </aside>
    </>
  )
}
