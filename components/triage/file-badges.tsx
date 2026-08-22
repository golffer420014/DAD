import { AlertTriangle } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'

export function DataQualityBanner() {
  const files = useDashboardStore((state) => state.files)
  const viewFile = useDashboardStore((state) => state.viewFile)

  const problemFiles = files.filter((file) => file.status === 'Empty' || file.status === 'Error')
  if (problemFiles.length === 0) return null

  return (
    <div className="mb-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
      <div className="flex items-center gap-2 font-medium text-destructive">
        <AlertTriangle className="size-4" /> พบไฟล์ที่อาจอ่านข้อมูลไม่ได้ {problemFiles.length} ไฟล์
      </div>
      <p className="mt-1 text-xs text-muted-foreground">ตรวจสอบว่าไฟล์มีคอลัมน์ "เลข" ครบถ้วนหรือไม่ — ยอดจากไฟล์เหล่านี้จะไม่ถูกรวมเข้าชุดข้อมูล</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {problemFiles.map((file) => (
          <li key={file.id}>
            <button
              onClick={() => viewFile(file.name)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-background px-2.5 py-1 text-xs font-medium hover:bg-destructive/10"
            >
              {file.name} · {file.status === 'Error' ? 'อ่านไฟล์ไม่ได้' : 'ไม่พบข้อมูล'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
