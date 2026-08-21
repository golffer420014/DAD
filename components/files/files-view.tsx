import { useDashboardStore } from '@/lib/store'
import { FileCard } from '@/components/files/file-card'

export function FilesView() {
  const files = useDashboardStore((state) => state.files)

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Source management</p>
        <h1 className="text-3xl font-semibold tracking-tight">ไฟล์ที่นำเข้า</h1>
        <p className="mt-2 text-sm text-muted-foreground">จัดการไฟล์และดูสถานะการวิเคราะห์ข้อมูล</p>
      </div>
      {files.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">ยังไม่มีไฟล์ที่นำเข้า ไปที่แดชบอร์ดเพื่อนำเข้า Excel</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  )
}
