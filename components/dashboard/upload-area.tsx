'use client'

import { useRef, useState } from 'react'
import { FileSpreadsheet, Plus, Upload } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'

// MVP demo only: lets a reviewer try the flow without hunting for a file on
// disk. Real users always pick their own file — this list can be removed
// once the demo period is over.
const SAMPLE_FILES = [
  '16 สค 69 ติ๊ก.xlsx',
  'ซี 16 สิงหาคม 2569.xlsx',
  'ติ๋ว-16-08-69.xlsx',
  'ปุ๋ย1.xlsx',
  'ฝน 16 ส.ค. 69.xlsx',
  'เมย์.xlsx',
]

export function UploadArea() {
  const processing = useDashboardStore((state) => state.processing)
  const importFiles = useDashboardStore((state) => state.importFiles)
  const inputRef = useRef<HTMLInputElement>(null)
  const [loadingSample, setLoadingSample] = useState<string | null>(null)

  const importSample = async (name: string) => {
    setLoadingSample(name)
    try {
      const res = await fetch(`/samples/${encodeURIComponent(name)}`)
      const blob = await res.blob()
      const file = new File([blob], name, { type: blob.type })
      await importFiles([file])
    } finally {
      setLoadingSample(null)
    }
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); importFiles(e.dataTransfer.files) }}
      className="relative overflow-hidden rounded-2xl border border-dashed bg-card p-8 text-center shadow-sm md:p-10"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: 'radial-gradient(color-mix(in oklch, var(--muted-foreground) 14%, transparent) 1px, transparent 1px)', backgroundSize: '18px 18px' }}
      />
      <div className="relative mx-auto flex max-w-xl flex-col items-center">
        <div className="mb-4 grid size-12 place-items-center rounded-xl border bg-background shadow-sm">
          <Upload className="size-5 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold">{processing ? 'กำลังวิเคราะห์ไฟล์...' : 'นำเข้า Excel Files'}</h2>
        <p className="mt-1 text-sm text-muted-foreground">ลากไฟล์มาวางที่นี่ หรือเลือกไฟล์จากคอมพิวเตอร์</p>
        {processing ? (
          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-3 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" /> Reading files · Detecting columns · Calculating totals
          </div>
        ) : (
          <>
            <input ref={inputRef} type="file" multiple accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => importFiles(e.target.files)} />
            <button onClick={() => inputRef.current?.click()} className="mt-5 inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent">
              <Plus className="size-4" /> เลือกไฟล์
            </button>
            <p className="mt-4 text-[11px] text-muted-foreground">รองรับ .xlsx, .xls, .csv · ไฟล์จะถูกประมวลผลในเบราว์เซอร์ของคุณ</p>

            <div className="mt-6 w-full border-t pt-5">
              <p className="text-[11px] font-medium text-muted-foreground">หรือเลือกไฟล์ตัวอย่าง (สำหรับทดสอบ)</p>
              <div className="mt-2.5 flex flex-wrap justify-center gap-2">
                {SAMPLE_FILES.map((name) => (
                  <button
                    key={name}
                    onClick={() => importSample(name)}
                    disabled={loadingSample !== null}
                    className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-accent disabled:opacity-50"
                  >
                    <FileSpreadsheet className="size-3.5 text-muted-foreground" />
                    {loadingSample === name ? 'กำลังโหลด...' : name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
