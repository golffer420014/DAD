'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'
import { aggregateByNumber, getRiskFlags, money } from '@/lib/format'
import { SectionHeader } from '@/components/shared/section-header'
import { SortableTh } from '@/components/shared/sortable-th'
import { cn } from '@/lib/utils'

type SortKey = 'number' | 'top' | 'bottom' | 'tod' | 'total'

export function NumbersTable() {
  const records = useDashboardStore((state) => state.records)
  const selectRecord = useDashboardStore((state) => state.selectRecord)
  const riskLimits = useDashboardStore((state) => state.riskLimits)
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
  const flagged = sorted.map((row) => ({ row, flags: getRiskFlags(row, riskLimits) }))
  const riskyCount = flagged.filter((f) => f.flags.any).length

  const th = (key: SortKey, label: string, align: 'left' | 'right', className: string) => (
    <SortableTh label={label} align={align} active={sortKey === key} direction={sortDir} onClick={() => toggleSort(key)} className={className} />
  )

  return (
    <section className="mt-6 overflow-hidden rounded-xl border bg-card shadow-sm">
      <SectionHeader
        title="เลขรวมจากทุกไฟล์"
        subtitle="รวมยอดเลขเดียวกันจากไฟล์ที่นำเข้าทั้งหมด"
        right={
          riskyCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
              <AlertTriangle className="size-3.5" /> เกินเพดาน {riskyCount} เลข
            </span>
          ) : null
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
              <th className="px-5 py-3 text-left font-medium">#</th>
              {th('number', 'เลข', 'left', 'px-3 py-3 text-left')}
              {th('top', 'บนรวม', 'right', 'px-3 py-3 text-right')}
              {th('bottom', 'ล่างรวม', 'right', 'px-3 py-3 text-right')}
              {th('tod', 'โต๊ดรวม', 'right', 'px-3 py-3 text-right')}
              {th('total', 'ยอดรวม', 'right', 'px-5 py-3 text-right')}
            </tr>
          </thead>
          <tbody>
            {flagged.map(({ row, flags }, i) => (
              <tr key={row.number} className={cn('border-b last:border-0 hover:bg-muted/50', flags.any && 'bg-destructive/5')}>
                <td className="px-5 py-3 text-muted-foreground">{String(i + 1).padStart(2, '0')}</td>
                <td className="px-3 py-3">
                  <button className="inline-flex items-center gap-1.5 font-mono font-semibold underline-offset-4 hover:underline" onClick={() => selectRecord(row)}>
                    {flags.any && <AlertTriangle className="size-3.5 text-destructive" />}
                    {row.number}
                  </button>
                </td>
                <td className={cn('px-3 py-3 text-right', flags.top && 'font-semibold text-destructive')}>{money(row.top)}</td>
                <td className={cn('px-3 py-3 text-right', flags.bottom && 'font-semibold text-destructive')}>{money(row.bottom)}</td>
                <td className={cn('px-3 py-3 text-right', flags.tod && 'font-semibold text-destructive')}>{money(row.tod)}</td>
                <td className="px-5 py-3 text-right font-semibold">{money(row.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 bg-muted/40 font-semibold">
              <td className="px-5 py-3" colSpan={2}>รวมทั้งหมด</td>
              <td className="px-3 py-3 text-right">{money(numbers.reduce((sum, row) => sum + row.top, 0))}</td>
              <td className="px-3 py-3 text-right">{money(numbers.reduce((sum, row) => sum + row.bottom, 0))}</td>
              <td className="px-3 py-3 text-right">{money(numbers.reduce((sum, row) => sum + row.tod, 0))}</td>
              <td className="px-5 py-3 text-right">{money(numbers.reduce((sum, row) => sum + row.top + row.bottom + row.tod, 0))}</td>
            </tr>
          </tfoot>
        </table>
        {numbers.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">นำเข้าไฟล์เพื่อดูเลขที่ถูกรวมข้อมูล</p>}
      </div>
    </section>
  )
}
