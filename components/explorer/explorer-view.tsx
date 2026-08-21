import { ExplorerToolbar } from '@/components/explorer/explorer-toolbar'
import { ExplorerTable } from '@/components/explorer/explorer-table'

export function ExplorerView() {
  return (
    <div className="flex h-full min-h-0 flex-col animate-in fade-in duration-500">
      <h1 className="mb-3 text-xl font-semibold tracking-tight">ข้อมูลดิบ</h1>
      <div className="flex min-h-0 flex-1 flex-col rounded-xl border bg-card shadow-sm">
        <ExplorerToolbar />
        <ExplorerTable />
      </div>
    </div>
  )
}
