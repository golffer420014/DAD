import { ArrowDownToLine, Search } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'
import { downloadRecordsAsCsv, filterRecords } from '@/lib/format'

export function ExplorerToolbar() {
  const search = useDashboardStore((state) => state.search)
  const setSearch = useDashboardStore((state) => state.setSearch)
  const fileFilter = useDashboardStore((state) => state.fileFilter)
  const setFileFilter = useDashboardStore((state) => state.setFileFilter)
  const records = useDashboardStore((state) => state.records)
  const files = useDashboardStore((state) => state.files)

  return (
    <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาเลข หรือชื่อไฟล์..."
          className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <select
        value={fileFilter}
        onChange={(e) => setFileFilter(e.target.value)}
        className="h-9 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">ทุกไฟล์</option>
        {[...new Set(files.map((file) => file.name))].map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
      <button
        onClick={() => downloadRecordsAsCsv(filterRecords(records, search, fileFilter))}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-sm hover:bg-accent"
      >
        <ArrowDownToLine className="size-4" /> Export CSV
      </button>
    </div>
  )
}
