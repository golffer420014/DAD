import { useDashboardStore } from '@/lib/store'
import { FileCard } from '@/components/files/file-card'

export function FilesView() {
  const files = useDashboardStore((state) => state.files)

  return (
    <div className="h-full min-h-0 overflow-y-auto animate-in fade-in duration-500">
      <h1 className="mb-3 text-xl font-semibold tracking-tight">ไฟล์ที่นำเข้า</h1>
      {files.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">ยังไม่มีไฟล์ที่นำเข้า ไปที่หน้าคัดกรองเพื่อนำเข้า Excel</div>
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
