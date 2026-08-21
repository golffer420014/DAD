'use client'

import { useState } from 'react'
import { AlertTriangle, ArrowDownToLine, ShieldCheck, Wand2, X } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'
import { aggregateByNumber, getRiskFlags, money } from '@/lib/format'
import { downloadForwardExcel } from '@/lib/excel-template'
import { SectionHeader } from '@/components/shared/section-header'
import { SortableTh } from '@/components/shared/sortable-th'
import { cn } from '@/lib/utils'

type SortKey = 'number' | 'top' | 'bottom' | 'tod' | 'total'

export function TriageTable() {
  const records = useDashboardStore((state) => state.records)
  const selectRecord = useDashboardStore((state) => state.selectRecord)
  const riskLimits = useDashboardStore((state) => state.riskLimits)
  const held = useDashboardStore((state) => state.held)
  const toggleHeld = useDashboardStore((state) => state.toggleHeld)
  const applySuggestedHold = useDashboardStore((state) => state.applySuggestedHold)
  const clearHeld = useDashboardStore((state) => state.clearHeld)
  const [sortKey, setSortKey] = useState<SortKey>('total')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const numbers = aggregateByNumber(records)
  const sorted = [...numbers].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    if (sortKey === 'number') return a.number.localeCompare(b.number, undefined, { numeric: true }) * dir
    return (a[sortKey] - b[sortKey]) * dir
  })
  const rows = sorted.map((row) => ({ row, flags: getRiskFlags(row, riskLimits), isHeld: !!held[row.number] }))

  const heldRows = rows.filter((r) => r.isHeld)
  const forwardRows = rows.filter((r) => !r.isHeld)
  const heldTotal = heldRows.reduce((sum, r) => sum + r.row.total, 0)
  const forwardTotal = forwardRows.reduce((sum, r) => sum + r.row.total, 0)
  const hasLimits = riskLimits.top > 0 || riskLimits.bottom > 0 || riskLimits.tod > 0
  const hasSelection = Object.values(held).some(Boolean)

  const stickyTh = 'sticky top-0 z-10 border-b bg-muted/95 backdrop-blur-sm'

  const th = (key: SortKey, label: string, align: 'left' | 'right', className: string) => (
    <SortableTh label={label} align={align} active={sortKey === key} direction={sortDir} onClick={() => toggleSort(key)} className={cn(className, stickyTh)} />
  )

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
      <SectionHeader
        title="เลขรวมจากทุกไฟล์"
        subtitle="เลือกเลขที่จะกั๊กไว้เอง ส่วนที่เหลือส่งออกเพื่อส่งต่อขึ้นสายบน"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={applySuggestedHold}
              disabled={!hasLimits || numbers.length === 0}
              title={hasLimits ? 'กั๊กเลขที่ยอดต่ำกว่าเพดานในหน้าตั้งค่า' : 'ยังไม่ได้ตั้งเพดานใน Settings'}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border bg-background px-2.5 text-xs font-medium hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
            >
              <Wand2 className="size-3.5" /> ใช้คำแนะนำอัตโนมัติ
            </button>
            <button
              onClick={clearHeld}
              disabled={!hasSelection}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border bg-background px-2.5 text-xs font-medium hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
            >
              <X className="size-3.5" /> ล้างการเลือก
            </button>
            <button
              onClick={() => downloadForwardExcel(forwardRows.map((r) => r.row))}
              disabled={forwardRows.length === 0}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-xs font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
            >
              <ArrowDownToLine className="size-3.5" /> ส่งต่อ (Excel)
            </button>
          </div>
        }
      />
      {numbers.length > 0 && (
        <div className="flex flex-wrap gap-3 border-b bg-muted/30 px-5 py-3 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="size-3.5" /> กั๊กไว้เอง {heldRows.length} เลข · {money(heldTotal)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
            <ArrowDownToLine className="size-3.5" /> ส่งต่อ {forwardRows.length} เลข · {money(forwardTotal)}
          </span>
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[800px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className={cn('px-5 py-3 text-left font-medium', stickyTh)}>กั๊ก</th>
              {th('number', 'เลข', 'left', 'px-3 py-3 text-left')}
              {th('top', 'บนรวม', 'right', 'px-3 py-3 text-right')}
              {th('bottom', 'ล่างรวม', 'right', 'px-3 py-3 text-right')}
              {th('tod', 'โต๊ดรวม', 'right', 'px-3 py-3 text-right')}
              <th className={cn('px-3 py-3 text-right font-medium', stickyTh)}>บน x ล่าง x โต๊ด</th>
              {th('total', 'ยอดรวม', 'right', 'px-5 py-3 text-right')}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ row, flags, isHeld }) => (
              <tr key={row.number} className={cn('[&>td]:border-b hover:bg-muted/50', isHeld && 'bg-emerald-500/5', !isHeld && flags.any && 'bg-destructive/5')}>
                <td className="px-5 py-3">
                  <input
                    type="checkbox"
                    checked={isHeld}
                    onChange={() => toggleHeld(row.number)}
                    className="size-4 rounded border-muted-foreground/40"
                  />
                </td>
                <td className="px-3 py-3">
                  <button className="inline-flex items-center gap-1.5 font-mono font-semibold underline-offset-4 hover:underline" onClick={() => selectRecord(row)}>
                    {!isHeld && flags.any && (
                      <span title="ยอดเกินเพดาน แนะนำส่งต่อ">
                        <AlertTriangle className="size-3.5 text-destructive" />
                      </span>
                    )}
                    {row.number}
                  </button>
                </td>
                <td className={cn('px-3 py-3 text-right', flags.top && 'font-semibold text-destructive')}>{money(row.top)}</td>
                <td className={cn('px-3 py-3 text-right', flags.bottom && 'font-semibold text-destructive')}>{money(row.bottom)}</td>
                <td className={cn('px-3 py-3 text-right', flags.tod && 'font-semibold text-destructive')}>{money(row.tod)}</td>
                <td className="px-3 py-3 text-right font-mono text-xs text-muted-foreground">{row.top} x {row.bottom} x {row.tod}</td>
                <td className="px-5 py-3 text-right font-semibold">{money(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {numbers.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">นำเข้าไฟล์เพื่อดูเลขที่ถูกรวมข้อมูล</p>}
      </div>
      {numbers.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t p-4 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">รวมทั้งหมด {numbers.length.toLocaleString()} เลข</span>
          <span>
            บน {money(numbers.reduce((sum, row) => sum + row.top, 0))} · ล่าง {money(numbers.reduce((sum, row) => sum + row.bottom, 0))} · โต๊ด{' '}
            {money(numbers.reduce((sum, row) => sum + row.tod, 0))} ·{' '}
            <span className="font-semibold text-foreground">รวม {money(numbers.reduce((sum, row) => sum + row.top + row.bottom + row.tod, 0))}</span>
          </span>
        </div>
      )}
    </section>
  )
}
