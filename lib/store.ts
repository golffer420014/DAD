import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import ExcelJS from 'exceljs'
import type { FileSummary, Held, RecordRow, RiskLimits } from '@/lib/types'
import { aggregateByNumber, getRiskFlags } from '@/lib/format'

type DashboardStore = {
  // state
  files: FileSummary[]
  records: RecordRow[]
  selected: RecordRow | null
  processing: boolean
  mobileNav: boolean
  riskLimits: RiskLimits
  held: Held

  // actions
  selectRecord: (row: RecordRow | null) => void
  setMobileNav: (open: boolean) => void
  toggleMobileNav: () => void
  importFiles: (fileList: FileList | File[] | null) => Promise<void>
  removeFile: (id: string) => void
  setRiskLimits: (limits: RiskLimits) => void
  toggleHeld: (number: string) => void
  applySuggestedHold: () => void
  clearHeld: () => void
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      files: [],
      records: [],
      selected: null,
      processing: false,
      mobileNav: false,
      riskLimits: { top: 0, bottom: 0, tod: 0 },
      held: {},

      selectRecord: (row) => set({ selected: row }),
      setMobileNav: (open) => set({ mobileNav: open }),
      toggleMobileNav: () => set((state) => ({ mobileNav: !state.mobileNav })),
      setRiskLimits: (riskLimits) => set({ riskLimits }),
      toggleHeld: (number) => set((state) => ({ held: { ...state.held, [number]: !state.held[number] } })),
      applySuggestedHold: () => {
        const { records, riskLimits } = get()
        if (riskLimits.top <= 0 && riskLimits.bottom <= 0 && riskLimits.tod <= 0) return
        const held: Held = {}
        for (const row of aggregateByNumber(records)) held[row.number] = !getRiskFlags(row, riskLimits).any
        set({ held })
      },
      clearHeld: () => set({ held: {} }),

      importFiles: async (fileList) => {
        if (!fileList?.length) return
        set({ processing: true })

        const additions: RecordRow[] = []
        const summaries: FileSummary[] = []

        for (const file of Array.from(fileList)) {
          const id = crypto.randomUUID()
          try {
            const buffer = await file.arrayBuffer()
            const workbook = new ExcelJS.Workbook()
            await workbook.xlsx.load(buffer)
            const sheet = workbook.worksheets[0]
            const headers = Array.from(sheet.getRow(1).values as unknown[], (v) => String(v ?? '').toLowerCase())
            const findIndex = (keys: string[]) => headers.findIndex((header) => keys.some((needle) => header.includes(needle)))
            const numberIndex = findIndex(['เลข', 'number'])

            const fileRecords: RecordRow[] = []
            for (let r = 2; r <= sheet.rowCount; r++) {
              const values = sheet.getRow(r).values as unknown[]
              const number = String((numberIndex >= 0 ? values[numberIndex] : '') ?? '').trim()
              if (!/^\d+$/.test(number)) continue
              const parse = (value: unknown) => Number(String(value ?? '').replace(/,/g, '')) || 0
              // Some sheets leave บน/ล่าง/โต๊ด headers blank; fall back to their position
              // right after the เลข column (the layout every one of these sheets uses).
              const byNameOrPosition = (keys: string[], offsetFromNumber: number) => {
                const namedIndex = findIndex(keys)
                if (namedIndex >= 0) return values[namedIndex]
                return numberIndex >= 0 ? values[numberIndex + offsetFromNumber] : undefined
              }
              fileRecords.push({
                fileId: id,
                sourceFile: file.name,
                number,
                top: parse(byNameOrPosition(['บน', 'top'], 1)),
                bottom: parse(byNameOrPosition(['ล่าง', 'bottom'], 2)),
                tod: parse(byNameOrPosition(['โต๊ด', 'tod'], 3)),
              })
            }
            additions.push(...fileRecords)
            summaries.push({
              id,
              name: file.name,
              records: fileRecords.length,
              total: fileRecords.reduce((sum, r) => sum + r.top + r.bottom + r.tod, 0),
              importedAt: Date.now(),
              size: `${Math.round(file.size / 1024)} KB`,
              status: fileRecords.length ? 'Ready' : 'Empty',
            })
          } catch {
            summaries.push({ id, name: file.name, records: 0, total: 0, importedAt: Date.now(), size: `${Math.round(file.size / 1024)} KB`, status: 'Error' })
          }
        }

        set((state) => ({
          records: [...state.records, ...additions],
          files: [...state.files, ...summaries],
          processing: false,
        }))
      },

      removeFile: (id) =>
        set((state) => ({
          files: state.files.filter((file) => file.id !== id),
          records: state.records.filter((record) => record.fileId !== id),
          selected: state.selected?.fileId === id ? null : state.selected,
        })),
    }),
    {
      name: 'excel-analytics-settings',
      partialize: (state) => ({ riskLimits: state.riskLimits }),
    },
  ),
)
