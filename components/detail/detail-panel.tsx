import { X } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'
import { money } from '@/lib/format'

export function DetailPanel() {
  const selected = useDashboardStore((state) => state.selected)
  const records = useDashboardStore((state) => state.records)
  const selectRecord = useDashboardStore((state) => state.selectRecord)

  if (!selected) return null

  const matches = records.filter((record) => record.number === selected.number)
  const total = matches.reduce((sum, record) => sum + record.top + record.bottom + record.tod, 0)
  const bySource = Object.values(
    matches.reduce<Record<string, { sourceFile: string; top: number; bottom: number; tod: number }>>((acc, record) => {
      acc[record.sourceFile] ??= { sourceFile: record.sourceFile, top: 0, bottom: 0, tod: 0 }
      acc[record.sourceFile].top += record.top
      acc[record.sourceFile].bottom += record.bottom
      acc[record.sourceFile].tod += record.tod
      return acc
    }, {}),
  )
  const close = () => selectRecord(null)

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20 backdrop-blur-sm" onClick={close}>
      <aside className="h-full w-full max-w-md overflow-y-auto border-l bg-background p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Number detail</p>
            <h2 className="mt-2 font-mono text-4xl font-semibold">{selected.number}</h2>
          </div>
          <button onClick={close} className="rounded-lg p-2 hover:bg-accent">
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="mt-2 text-xl font-semibold">{money(total)}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">แหล่งข้อมูล</p>
            <p className="mt-2 text-xl font-semibold">{bySource.length} ไฟล์</p>
          </div>
        </div>
        <h3 className="mt-8 font-semibold">Source Breakdown</h3>
        <div className="mt-3 flex flex-col gap-2">
          {bySource.map((item) => (
            <div key={item.sourceFile} className="rounded-xl border bg-card p-4">
              <p className="truncate text-sm font-medium">{item.sourceFile}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">บน</p>
                  <p className="mt-1 font-semibold">{money(item.top)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ล่าง</p>
                  <p className="mt-1 font-semibold">{money(item.bottom)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">โต๊ด</p>
                  <p className="mt-1 font-semibold">{money(item.tod)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
