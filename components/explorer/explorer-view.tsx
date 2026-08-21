import { ExplorerToolbar } from '@/components/explorer/explorer-toolbar'
import { ExplorerTable } from '@/components/explorer/explorer-table'

export function ExplorerView() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Normalized records</p>
        <h1 className="text-3xl font-semibold tracking-tight">สำรวจข้อมูล</h1>
        <p className="mt-2 text-sm text-muted-foreground">ตรวจสอบข้อมูลที่ถูกทำให้เป็นมาตรฐานจากทุกไฟล์</p>
      </div>
      <div className="rounded-xl border bg-card shadow-sm">
        <ExplorerToolbar />
        <ExplorerTable />
      </div>
    </div>
  )
}
