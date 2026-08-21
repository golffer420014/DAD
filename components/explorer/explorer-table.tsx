'use client'

import { useEffect, useState } from 'react'
import { useDashboardStore } from '@/lib/store'
import { filterRecords, money } from '@/lib/format'
import { SortableTh } from '@/components/shared/sortable-th'

const PAGE_SIZE = 25

type SortKey = 'sourceFile' | 'number' | 'top' | 'bottom' | 'tod' | 'total'

export function ExplorerTable() {
  const records = useDashboardStore((state) => state.records)
  const search = useDashboardStore((state) => state.search)
  const fileFilter = useDashboardStore((state) => state.fileFilter)
  const selectRecord = useDashboardStore((state) => state.selectRecord)
  const [page, setPage] = useState(1)
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
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const paged = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => setPage(1), [search, fileFilter])

  if (records.length === 0) {
    return <p className="p-12 text-center text-sm text-muted-foreground">นำเข้าไฟล์ Excel เพื่อดูข้อมูลที่นี่</p>
  }

  const th = (key: SortKey, label: string, align: 'left' | 'right', className: string) => (
    <SortableTh label={label} align={align} active={sortKey === key} direction={sortDir} onClick={() => toggleSort(key)} className={className} />
  )

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="sticky top-0 bg-muted/60">
            <tr className="border-b text-xs text-muted-foreground">
              {th('sourceFile', 'Source', 'left', 'px-5 py-3 text-left')}
              {th('number', 'Number', 'left', 'px-3 py-3 text-left')}
              {th('top', 'บน', 'right', 'px-3 py-3 text-right')}
              {th('bottom', 'ล่าง', 'right', 'px-3 py-3 text-right')}
              {th('tod', 'โต๊ด', 'right', 'px-3 py-3 text-right')}
              {th('total', 'Total', 'right', 'px-5 py-3 text-right')}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, index) => (
              <tr key={`${row.sourceFile}-${row.number}-${index}`} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3 text-muted-foreground">{row.sourceFile}</td>
                <td className="px-3 py-3">
                  <button onClick={() => selectRecord(row)} className="font-mono font-semibold underline-offset-4 hover:underline">
                    {row.number}
                  </button>
                </td>
                <td className="px-3 py-3 text-right">{money(row.top)}</td>
                <td className="px-3 py-3 text-right">{money(row.bottom)}</td>
                <td className="px-3 py-3 text-right">{money(row.tod)}</td>
                <td className="px-5 py-3 text-right font-semibold">{money(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-12 text-center text-sm text-muted-foreground">ไม่พบข้อมูลที่ตรงกับตัวกรอง</p>}
      </div>
      {rows.length > 0 && (
        <div className="flex items-center justify-between p-4 text-xs text-muted-foreground">
          <span>แสดง {paged.length.toLocaleString()} จาก {rows.length.toLocaleString()} รายการ</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="rounded border px-2 py-1 hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
            >
              ก่อนหน้า
            </button>
            <span>หน้า {currentPage} จาก {pageCount}</span>
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={currentPage >= pageCount}
              className="rounded border px-2 py-1 hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
            >
              ถัดไป
            </button>
          </div>
        </div>
      )}
    </>
  )
}
