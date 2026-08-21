'use client'

import { useState } from 'react'
import { useDashboardStore } from '@/lib/store'
import { filterRecords, money } from '@/lib/format'
import { SortableTh } from '@/components/shared/sortable-th'
import { cn } from '@/lib/utils'

type SortKey = 'sourceFile' | 'number' | 'top' | 'bottom' | 'tod' | 'total'

export function ExplorerTable() {
  const records = useDashboardStore((state) => state.records)
  const search = useDashboardStore((state) => state.search)
  const fileFilter = useDashboardStore((state) => state.fileFilter)
  const selectRecord = useDashboardStore((state) => state.selectRecord)
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = filterRecords(records, search, fileFilter)
  const withTotal = filtered.map((row) => ({ ...row, total: row.top + row.bottom + row.tod }))
  const rows = sortKey
    ? [...withTotal].sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1
        if (sortKey === 'sourceFile') return a.sourceFile.localeCompare(b.sourceFile) * dir
        if (sortKey === 'number') return a.number.localeCompare(b.number, undefined, { numeric: true }) * dir
        return (a[sortKey] - b[sortKey]) * dir
      })
    : withTotal

  if (records.length === 0) {
    return <p className="p-12 text-center text-sm text-muted-foreground">นำเข้าไฟล์ Excel เพื่อดูข้อมูลที่นี่</p>
  }

  const stickyTh = 'sticky top-0 z-10 border-b bg-muted/95 backdrop-blur-sm'

  const th = (key: SortKey, label: string, align: 'left' | 'right', className: string) => (
    <SortableTh label={label} align={align} active={sortKey === key} direction={sortDir} onClick={() => toggleSort(key)} className={cn(className, stickyTh)} />
  )

  return (
    <>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[800px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              {th('sourceFile', 'Source', 'left', 'px-5 py-3 text-left')}
              {th('number', 'Number', 'left', 'px-3 py-3 text-left')}
              {th('top', 'บน', 'right', 'px-3 py-3 text-right')}
              {th('bottom', 'ล่าง', 'right', 'px-3 py-3 text-right')}
              {th('tod', 'โต๊ด', 'right', 'px-3 py-3 text-right')}
              <th className={cn('px-3 py-3 text-right font-medium', stickyTh)}>บน x ล่าง x โต๊ด</th>
              {th('total', 'Total', 'right', 'px-5 py-3 text-right')}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.sourceFile}-${row.number}-${index}`} className="[&>td]:border-b hover:bg-muted/50">
                <td className="px-5 py-3 text-muted-foreground">{row.sourceFile}</td>
                <td className="px-3 py-3">
                  <button onClick={() => selectRecord(row)} className="font-mono font-semibold underline-offset-4 hover:underline">
                    {row.number}
                  </button>
                </td>
                <td className="px-3 py-3 text-right">{money(row.top)}</td>
                <td className="px-3 py-3 text-right">{money(row.bottom)}</td>
                <td className="px-3 py-3 text-right">{money(row.tod)}</td>
                <td className="px-3 py-3 text-right font-mono text-xs text-muted-foreground">{row.top} x {row.bottom} x {row.tod}</td>
                <td className="px-5 py-3 text-right font-semibold">{money(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-12 text-center text-sm text-muted-foreground">ไม่พบข้อมูลที่ตรงกับตัวกรอง</p>}
      </div>
      {rows.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t p-4 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">ทั้งหมด {rows.length.toLocaleString()} รายการ</span>
          <span>
            บน {money(rows.reduce((sum, row) => sum + row.top, 0))} · ล่าง {money(rows.reduce((sum, row) => sum + row.bottom, 0))} · โต๊ด{' '}
            {money(rows.reduce((sum, row) => sum + row.tod, 0))} ·{' '}
            <span className="font-semibold text-foreground">รวม {money(rows.reduce((sum, row) => sum + row.total, 0))}</span>
          </span>
        </div>
      )}
    </>
  )
}
