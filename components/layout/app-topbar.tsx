'use client'

import { useRef } from 'react'
import { ChevronRight, Upload } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'

export function AppTopbar() {
  const importFiles = useDashboardStore((state) => state.importFiles)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>จัดการโพย</span>
        <ChevronRight className="size-4" />
        <span className="text-foreground">คัดกรอง</span>
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
      </div>
    </header>
  )
}
