'use client'

import { useRef } from 'react'
import { ArrowDownToLine, ChevronRight, Menu, Upload } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'
import { downloadRecordsAsCsv } from '@/lib/format'

const VIEW_LABEL = { dashboard: 'แดชบอร์ด', explorer: 'สำรวจข้อมูล', files: 'ไฟล์ที่นำเข้า', settings: 'ตั้งค่า' } as const

export function AppTopbar() {
  const view = useDashboardStore((state) => state.view)
  const mobileNav = useDashboardStore((state) => state.mobileNav)
  const records = useDashboardStore((state) => state.records)
  const setMobileNav = useDashboardStore((state) => state.setMobileNav)
  const importFiles = useDashboardStore((state) => state.importFiles)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:px-8">
      <button className="rounded-lg p-2 hover:bg-accent lg:hidden" onClick={() => setMobileNav(!mobileNav)}>
        <Menu className="size-5" />
      </button>
      <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
        <span>Excel Analytics</span>
        <ChevronRight className="size-4" />
        <span className="text-foreground">{VIEW_LABEL[view]}</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => importFiles(e.target.files)}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <Upload className="size-4" /> <span className="hidden sm:inline">นำเข้า Excel</span>
        </button>
        <button
          onClick={() => downloadRecordsAsCsv(records)}
          disabled={records.length === 0}
          title="ส่งออกข้อมูลทั้งหมดเป็น CSV"
          className="hidden items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-accent disabled:pointer-events-none disabled:opacity-40 sm:inline-flex"
        >
          <ArrowDownToLine className="size-4" /> ส่งออกรายงาน
        </button>
      </div>
    </header>
  )
}
