import { AlertTriangle } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'
import type { FileSummary } from '@/lib/types'

const STATUS_STYLE: Record<FileSummary['status'], string> = {
  Ready: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  Empty: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  Error: 'border-destructive/30 bg-destructive/5 text-destructive',
}

const STATUS_LABEL: Record<FileSummary['status'], string> = {
  Ready: 'พร้อมใช้งาน',
  Empty: 'ไม่พบข้อมูล',
  Error: 'อ่านไฟล์ไม่ได้',
}

export function FileBadges() {
  const files = useDashboardStore((state) => state.files)
  if (files.length === 0) return null

  return (
    <>
      {files.map((file) => (
        <span
          key={file.id}
          title={`${file.name} · ${STATUS_LABEL[file.status]}`}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[file.status]}`}
        >
          {file.status !== 'Ready' && <AlertTriangle className="size-3.5" />}
          {file.name}
        </span>
      ))}
    </>
  )
}
