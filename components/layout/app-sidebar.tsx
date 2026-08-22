import { SplitSquareVertical } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'

export function AppSidebar() {
  const mobileNav = useDashboardStore((state) => state.mobileNav)
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
