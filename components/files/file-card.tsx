import { FileSpreadsheet, X } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'
import { formatRelativeTime, money } from '@/lib/format'
import type { FileSummary } from '@/lib/types'

const STATUS_STYLE: Record<FileSummary['status'], string> = {
  Ready: 'bg-emerald-500/10 text-emerald-600',
  Empty: 'bg-amber-500/10 text-amber-600',
  Error: 'bg-destructive/10 text-destructive',
}

const STATUS_LABEL: Record<FileSummary['status'], string> = {
  Ready: 'พร้อมใช้งาน',
  Empty: 'ไม่พบข้อมูล',
  Error: 'ผิดพลาด',
}

export function FileCard({ file }: { file: FileSummary }) {
  const removeFile = useDashboardStore((state) => state.removeFile)
  const viewFile = useDashboardStore((state) => state.viewFile)

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-muted p-3">
          <FileSpreadsheet className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="truncate font-semibold">{file.name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">นำเข้า {formatRelativeTime(file.importedAt)} · {file.size}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${STATUS_STYLE[file.status]}`}>
              {STATUS_LABEL[file.status]}
            </span>
          </div>
          {file.status === 'Empty' && (
            <p className="mt-2 text-xs text-amber-600">ไม่พบคอลัมน์ เลข/บน/ล่าง/โต๊ด ที่ตรงรูปแบบในไฟล์นี้</p>
          )}
          <div className="mt-5 grid grid-cols-2 gap-4 border-t pt-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">รายการ</p>
              <p className="mt-1 font-semibold">{file.records.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">มูลค่ารวม</p>
              <p className="mt-1 font-semibold">{money(file.total)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 border-t pt-4">
        <button
          onClick={() => viewFile(file.name)}
          disabled={file.records === 0}
          className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
        >
          ดูข้อมูล
        </button>
        <button onClick={() => removeFile(file.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
